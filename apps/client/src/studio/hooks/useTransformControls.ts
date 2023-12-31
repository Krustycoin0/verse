import { Engine } from "engine";
import { Dispatch, SetStateAction, useEffect } from "react";

import { StudioMode, Tool } from "../components/Studio";

export function useTransformControls(
  engine: Engine | null,
  selectedId: string | null,
  setSelectId: Dispatch<SetStateAction<string | null>>,
  mode: StudioMode,
  tool: Tool
) {
  // Update selected object when user clicks on an object
  useEffect(() => {
    if (!engine || mode === "play") return;

    engine.render.addEventListener("clicked_node", (e) => {
      setSelectId(e.data.nodeId);
    });
  }, [engine, mode, setSelectId]);

  // Attach transform controls to the selected object
  useEffect(() => {
    if (!engine) return;

    engine.render.send({
      data: { attach: mode === "edit", nodeId: selectedId },
      subject: "set_transform_controls_target",
    });
  }, [engine, selectedId, mode]);

  // Set mode
  useEffect(() => {
    if (!engine) return;

    engine.render.send({
      data: tool,
      subject: "set_transform_controls_mode",
    });
  }, [engine, tool]);
}
