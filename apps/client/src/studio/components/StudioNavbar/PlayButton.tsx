"use client";

import { FaPlay, FaStop } from "react-icons/fa";

import IconButton from "../../../ui/IconButton";
import Tooltip from "../../../ui/Tooltip";
import { useStudio } from "../Studio";

export default function PlayButton() {
  const { loaded, mode, changeMode } = useStudio();

  return (
    <Tooltip text={`${mode === "play" ? "Stop" : "Play"}`} side="bottom">
      <IconButton disabled={!loaded} onClick={() => changeMode(mode === "play" ? "edit" : "play")}>
        {mode === "play" ? <FaStop className="text-sm" /> : <FaPlay className="text-sm" />}
      </IconButton>
    </Tooltip>
  );
}
