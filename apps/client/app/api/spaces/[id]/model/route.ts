import { DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

import { env } from "@/src/env.mjs";
import { getUserSession } from "@/src/server/auth/getUserSession";
import { db } from "@/src/server/db/drizzle";
import { worldModel } from "@/src/server/db/schema";
import { listObjectsRecursive } from "@/src/server/helpers/listObjectsRecursive";
import { nanoidShort } from "@/src/server/nanoid";
import { s3Client } from "@/src/server/s3";
import { S3Path } from "@/src/utils/s3Paths";

import { Params, paramsSchema } from "../types";
import { PostSpaceModelResponse } from "./types";

// Create new space model
export async function POST(request: NextRequest, { params }: Params) {
  const session = await getUserSession();
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { id } = paramsSchema.parse(params);

  // Verify user owns the space
  const found = await db.query.world.findFirst({
    where: (row, { eq }) =>
      eq(row.ownerId, session.user.userId) && eq(row.publicId, id),
    with: { model: true },
  });
  if (!found) return new Response("Space not found", { status: 404 });

  // Remove existing space model
  const allObjects = await listObjectsRecursive(
    S3Path.worldModel(found.model.key).directory
  );

  await Promise.all([
    // Remove objects from S3
    allObjects.length > 0
      ? s3Client.send(
          new DeleteObjectsCommand({
            Bucket: env.S3_BUCKET,
            Delete: { Objects: allObjects.map((obj) => ({ Key: obj.Key })) },
          })
        )
      : null,

    // Remove from database
    db.delete(worldModel).where(eq(worldModel.id, found.model.id)).execute(),
  ]);

  // Create new space model
  const modelId = nanoidShort();

  await db
    .insert(worldModel)
    .values({ key: modelId, worldId: found.id })
    .execute();

  const json: PostSpaceModelResponse = { modelId };
  return NextResponse.json(json);
}
