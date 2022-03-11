import { Triplet } from "@react-three/cannon";

import { boxDefaultParams } from "./assets/Box";
import { sphereDefaultParams } from "./assets/Sphere";

export type Params = {
  position: Triplet;
  rotation: Triplet;
  scale: Triplet;
};

export enum AssetName {
  Box = "Box",
  Sphere = "Sphere",
}

export type Asset = {
  name: AssetName;
  limit?: number;
  params: Partial<Params>;
};

export type Instance = {
  id: string;
  name: AssetName;
  params: Partial<Params>;
};

export type Scene = {
  [key: string]: Instance;
};

export const ASSETS = {
  Box: {
    name: AssetName.Box,
    params: boxDefaultParams,
  } as Asset,
  Sphere: {
    name: AssetName.Sphere,
    params: sphereDefaultParams,
  } as Asset,
};
