import { ThreeEvent } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Group } from "three";

import { Entity, EntityComponent } from "@wired-xr/engine";

import { useStudioStore } from "../../../helpers/studio/store";

interface Props {
  entity: Entity;
}

export default function StudioInstancedEntity({ entity }: Props) {
  const ref = useRef<Group>(null);

  useEffect(() => {
    useStudioStore.getState().setRef(entity.id, ref);
    return () => useStudioStore.getState().removeRef(entity.id);
  }, [entity]);

  function handlePointerUp(e: ThreeEvent<PointerEvent>) {
    // @ts-ignore
    if (e.button !== 0) return;
    if (useStudioStore.getState().usingGizmo) return;

    //select the entity when clicked
    e.stopPropagation();
    useStudioStore.setState({ selectedId: entity.id });
  }

  return (
    <group ref={ref} onPointerUp={handlePointerUp}>
      <EntityComponent groupRef={ref} entity={entity}>
        {entity.children.map((child) => (
          <StudioInstancedEntity key={child.id} entity={child} />
        ))}
      </EntityComponent>
    </group>
  );
}
