import { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Physics } from "@react-three/cannon";
import { Group, PointLight, Raycaster } from "three";
import { Instance, InstancedObject, SceneObjects, SceneObjectType } from "3d";

import { sceneManager } from "../../helpers/store";

interface Props {
  type: SceneObjectType;
}

export default function ObjectCard({ type }: Props) {
  const instance: Instance<typeof type> = {
    id: "",
    type,
    properties: { ...SceneObjects[type].properties },
  };

  function handleClick() {
    sceneManager.newInstance(type);
  }

  return (
    <div
      onClick={handleClick}
      className="group hover:shadow-lg transition-all duration-300
                 rounded-2xl hover:cursor-pointer h-full w-full"
    >
      <Canvas className="rounded-xl group-hover:scale-110 transition-all duration-500 ease-in-out">
        <Physics>
          <CameraMover>
            <InstancedObject instance={instance} />
          </CameraMover>

          <ambientLight intensity={0.3} color="#f615ba" />
        </Physics>
      </Canvas>
    </div>
  );
}

function CameraMover({ children }) {
  const raycasterRef = useRef<Raycaster>();
  const lightRef = useRef<PointLight>();
  const childRef = useRef<Group>();

  const { camera } = useThree();

  useFrame((_, delta) => {
    camera.position.set(0, 0.4, 1.5);
    camera.getWorldPosition(lightRef.current.position);
    camera.lookAt(0, 0, 0);
    childRef.current.rotateY(delta / 2);
  });

  return (
    <group>
      <raycaster ref={raycasterRef} />
      <pointLight ref={lightRef} intensity={1} color="#26d4ef" />
      <group ref={childRef}>{children}</group>
    </group>
  );
}