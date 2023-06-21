import { NextRequest, NextResponse } from "next/server";

import { getUserSession } from "@/src/server/auth/getUserSession";
import { db } from "@/src/server/db/drizzle";

import { getWorldModelDownloadURL, getWorldModelUploadURL } from "./files";
import {
  GetFileDownloadResponse,
  GetFileUploadResponse,
  Params,
  paramsSchema,
} from "./types";

// Get file download URL
export async function GET(request: NextRequest, { params }: Params) {
  const session = await getUserSession();
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { id, file } = paramsSchema.parse(params);

  // Verify user owns the world
  const found = await db.query.world.findFirst({
    where: (row, { eq }) =>
      eq(row.ownerId, session.user.userId) && eq(row.publicId, id),
    with: { model: true },
  });
  if (!found) return new Response("world not found", { status: 404 });

  const url = await getWorldModelDownloadURL(found.model.key, file);

  const json: GetFileDownloadResponse = { url };
  return NextResponse.json(json);
}

// Get file upload URL
export async function PUT(request: NextRequest, { params }: Params) {
  const session = await getUserSession();
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { id, file } = paramsSchema.parse(params);

  // Verify user owns the world
  const found = await db.query.world.findFirst({
    where: (row, { eq }) =>
      eq(row.ownerId, session.user.userId) && eq(row.publicId, id),
    with: { model: true },
  });
  if (!found) return new Response("world not found", { status: 404 });

  const url = await getWorldModelUploadURL(found.model.key, file);

  const json: GetFileUploadResponse = { url };
  return NextResponse.json(json);
}
