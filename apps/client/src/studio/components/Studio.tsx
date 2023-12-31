"use client";

import { Engine } from "engine";
import Script from "next/script";
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Project } from "@/src/server/helpers/fetchProject";

import { useAutosave } from "../hooks/useAutosave";
import { useLoad } from "../hooks/useLoad";
import { useTransformControls } from "../hooks/useTransformControls";

export type StudioMode = "edit" | "play";
export type Tool = "translate" | "rotate" | "scale";

interface StudioContextType {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  changeMode: (value: StudioMode) => Promise<void>;
  description: string;
  engine: Engine | null;
  error: string | null;
  image: string | null;
  loaded: boolean;
  mode: StudioMode;
  resize: () => void;
  scriptId: string | null;
  selectedId: string | null;
  setDescription: Dispatch<SetStateAction<string>>;
  setImage: Dispatch<SetStateAction<string | null>>;
  setResize: Dispatch<SetStateAction<() => void>>;
  setScriptId: Dispatch<SetStateAction<string | null>>;
  setSelectedId: Dispatch<SetStateAction<string | null>>;
  setTitle: Dispatch<SetStateAction<string>>;
  setTool: Dispatch<SetStateAction<Tool>>;
  title: string;
  tool: Tool;
}

const defaultContext: StudioContextType = {
  canvasRef: React.createRef(),
  changeMode: async () => {},
  description: "",
  engine: null,
  error: null,
  image: null,
  loaded: false,
  mode: "edit",
  resize: () => {},
  scriptId: null,
  selectedId: null,
  setDescription: () => {},
  setImage: () => {},
  setResize: () => {},
  setScriptId: () => {},
  setSelectedId: () => {},
  setTitle: () => {},
  setTool: () => {},
  title: "",
  tool: "translate",
};

export const StudioContext = createContext<StudioContextType>(defaultContext);

export function useStudio() {
  return React.useContext(StudioContext);
}

interface Props {
  project: Project;
  animationPath?: string;
  defaultAvatar?: string;
  skybox?: string;
  children?: React.ReactNode;
}

export function Studio({ project, animationPath, defaultAvatar, skybox, children }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<Uint8Array | null>(null);
  const hasSceneRef = useRef(false);

  const [description, setDescription] = useState(project.description);
  const [engine, setEngine] = useState<Engine | null>(null);
  const [image, setImage] = useState<string | null>(project.image);
  const [mode, setMode] = useState<StudioMode>("edit");
  const [resize, setResize] = useState<() => void>(() => {});
  const [scriptId, setScriptId] = useState<string | null>(null);
  const [scriptsReady, setScriptsReady] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [title, setTitle] = useState(project.title);
  const [tool, setTool] = useState<Tool>("translate");

  const { error, loaded, load } = useLoad(engine);
  useTransformControls(engine, selectedId, setSelectedId, mode, tool);
  useAutosave(project, mode);

  // Update state on project change
  useEffect(() => {
    setDescription(project.description);
    setImage(project.image);
    setTitle(project.title);
    setScriptId(null);
    setSelectedId(null);
    setMode("edit");
  }, [project]);

  // Write the title to the document
  useEffect(() => {
    if (title) document.title = `${title} / UNAVI Studio`;
    else document.title = "UNAVI Studio";
  }, [title]);

  // Create engine
  useEffect(() => {
    if (!scriptsReady) return;

    const newEngine = new Engine();
    setEngine(newEngine);

    newEngine.controls = "orbit";
    newEngine.start();

    return () => {
      newEngine.destroy();
    };
  }, [scriptsReady]);

  useEffect(() => {
    if (!engine) return;
    engine.render.send({ data: animationPath ?? null, subject: "set_animations_path" });
  }, [engine, animationPath]);

  useEffect(() => {
    if (!engine) return;
    engine.render.send({ data: defaultAvatar ?? null, subject: "set_default_avatar" });
  }, [engine, defaultAvatar]);

  useEffect(() => {
    if (!engine) return;
    engine.render.send({ data: skybox ?? null, subject: "set_skybox" });
  }, [engine, skybox]);

  useEffect(() => {
    if (!engine) return;

    load(project);

    return () => {
      engine.scene.clear();
    };
  }, [engine, load, project]);

  const changeMode = useCallback(
    async (value: StudioMode) => {
      if (!engine || !loaded) return;

      if (value === "edit") {
        // Exit play mode
        engine.audio.stop();
        engine.behavior.stop();
        engine.controls = "orbit";
        engine.render.send({ data: false, subject: "toggle_animations" });

        // Load scene
        if (hasSceneRef.current) {
          engine.scene.clear();
          if (sceneRef.current) await engine.scene.addBinary(sceneRef.current);
          hasSceneRef.current = false;
        }
      } else if (value === "play") {
        // Export scene
        const glb = await engine.scene.export();
        sceneRef.current = glb;
        hasSceneRef.current = true;

        // Enter play mode
        engine.controls = "player";
        engine.physics.send({ data: null, subject: "respawn" });
        engine.render.send({ data: true, subject: "toggle_animations" });
        engine.behavior.start();
        await engine.audio.start();
      }

      setMode(value);
    },
    [engine, loaded]
  );

  const value = useMemo(
    () => ({
      canvasRef,
      changeMode,
      description,
      engine,
      error,
      image,
      loaded,
      mode,
      resize,
      scriptId,
      selectedId,
      setDescription,
      setImage,
      setResize,
      setScriptId,
      setSelectedId,
      setTitle,
      setTool,
      title,
      tool,
    }),
    [
      canvasRef,
      changeMode,
      description,
      engine,
      error,
      image,
      loaded,
      mode,
      resize,
      scriptId,
      selectedId,
      title,
      tool,
    ]
  );

  return (
    <>
      <Script src="/scripts/draco_decoder.js" onReady={() => setScriptsReady(true)} />
      <Script src="/scripts/draco_encoder.js" />

      <StudioContext.Provider value={value}>{children}</StudioContext.Provider>
    </>
  );
}
