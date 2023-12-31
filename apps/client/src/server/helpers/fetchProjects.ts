import { cache } from "react";

import { getProjectDownloadURL } from "@/app/api/projects/[id]/files/[file]/files";

import { getUserSession } from "../auth/getUserSession";
import { prisma } from "../prisma";

export const fetchProjects = cache(async (): Promise<Project[]> => {
  const session = await getUserSession();
  if (!session) throw new Error("Unauthorized");

  const projects = await prisma.project.findMany({
    orderBy: { updatedAt: "desc" },
    where: { ownerId: session.user.userId },
  });

  const images = await Promise.all(
    projects.map(({ publicId }) => getProjectDownloadURL(publicId, "image"))
  );

  const response: Project[] = projects.map((project, index) => ({
    createdAt: project.createdAt,
    description: project.description,
    image: images[index],
    ownerId: project.ownerId,
    publicId: project.publicId,
    spaceId: project.spaceId,
    title: project.title,
    updatedAt: project.updatedAt,
  }));

  return response;
});

export type Project = {
  createdAt: Date;
  description: string;
  image?: string;
  title: string;
  ownerId: string;
  publicId: string;
  spaceId: number | null;
  updatedAt: Date;
};
