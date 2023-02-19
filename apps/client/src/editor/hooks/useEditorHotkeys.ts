import { deepDisposeNode } from "engine";
import { useEffect } from "react";

import { useEditorStore } from "../store";

export function useEditorHotkeys() {
  // const [copiedId, setCopiedId] = useState<string>();

  useEffect(() => {
    async function handleKeyDown(e: KeyboardEvent) {
      const engine = useEditorStore.getState().engine;
      if (!engine) return;

      switch (e.key) {
        case "Delete": {
          const selectedId = useEditorStore.getState().selectedId;
          if (!selectedId) break;

          const node = engine.scene.node.store.get(selectedId);
          if (!node) throw new Error("Node not found");

          useEditorStore.setState({ selectedId: null });
          deepDisposeNode(node);
          break;
        }

        case "w": {
          useEditorStore.setState({ tool: "translate" });
          break;
        }

        case "e": {
          useEditorStore.setState({ tool: "rotate" });
          break;
        }

        case "r": {
          useEditorStore.setState({ tool: "scale" });
          break;
        }

        case "c": {
          // // Copy
          // if (e.ctrlKey) {
          //   const selectedId = useEditorStore.getState().selectedId;
          //   if (selectedId) setCopiedId(selectedId);
          // }
          break;
        }

        case "v": {
          // // Paste
          // if (e.ctrlKey) {
          //   if (!copiedId) return;

          //   const object = getObject(copiedId);
          //   if (!object) return;

          //   const clone = object.clone();
          //   addItemAsSibling(clone, object, "above");
          // }
          break;
        }
      }
    }
    // TODO: only use hotkeys when relevant area is focused
    // document.addEventListener("keydown", handleKeyDown);
    return () => {
      // document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
}
