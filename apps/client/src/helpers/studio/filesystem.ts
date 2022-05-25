import { Scene } from "@wired-xr/scene";

import { useStudioStore } from "./store";
import { Project } from "./types";

export const PROJECT_FILE_NAME = "project.json";

export async function readProject() {
  const root = useStudioStore.getState().rootHandle;
  if (!root) return;

  const handle = await root.getFileHandle(PROJECT_FILE_NAME);
  const file = await handle.getFile();
  const json = await file.text();

  const project: Project = JSON.parse(json);
  return project;
}

export async function writeScene(scene: Scene) {
  const root = useStudioStore.getState().rootHandle;
  if (!root) return;

  const project = await readProject();
  if (!project) return;

  const newProject: Project = {
    ...project,
    scene,
  };

  const handle = await root.getFileHandle(PROJECT_FILE_NAME);
  const writableStream = await handle.createWritable();
  await writableStream.write(JSON.stringify(newProject));
  await writableStream.close();
}
