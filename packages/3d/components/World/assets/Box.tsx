import { Triplet } from "@react-three/cannon";
import { Params } from "../types";

export const boxDefaultParams = {
  position: [0, 0, 0] as Triplet,
  rotation: [0, 0, 0] as Triplet,
  scale: [1, 1, 1] as Triplet,
};

interface Props {
  params: Partial<Params>;
}

export function Box({ params }: Props) {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial />
    </mesh>
  );
}
