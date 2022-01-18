import { useContext } from "react";
import { Button, Grid, Paper, Stack } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useRouter } from "next/router";
import { ClientContext, createWorld } from "matrix";
import { ColorIconButton, getHomeUrl } from "ui";

import { useStore } from "../../state/useStore";
import { useScene } from "../../state/useScene";

import SceneName from "./SceneName";
import Tools from "./Tools";

export default function Navbar() {
  const router = useRouter();

  const { client } = useContext(ClientContext);

  const id = useStore((set) => set.id);
  const save = useScene((set) => set.save);
  const toJSON = useScene((set) => set.toJSON);

  async function handleBack() {
    const canvas = document.querySelector("canvas");
    const image = canvas.toDataURL("image/jpeg");
    localStorage.setItem(`${id}-preview`, image);

    save();
    const json = toJSON();
    localStorage.setItem(`${id}-scene`, json);

    router.push(`/scene/${id}`);
  }

  async function handlePublish() {
    const name = localStorage.getItem(`${id}-name`);
    const description = localStorage.getItem(`${id}-description`);

    save();
    const scene = toJSON();

    const world = await createWorld(client, name, description, scene);

    const url = `${getHomeUrl()}/world/${world.room_id}`;
    router.push(url);
  }

  return (
    <Paper square variant="outlined" style={{ padding: "0.2rem" }}>
      <Grid container alignItems="center">
        <Grid item xs={4}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="flex-start"
            spacing={1}
          >
            <ColorIconButton onClick={handleBack}>
              <ArrowBackIosNewIcon className="NavbarIcon" />
            </ColorIconButton>

            <SceneName id={id} />
          </Stack>
        </Grid>

        <Grid item xs={4}>
          <Tools />
        </Grid>

        <Grid item xs={4}>
          <Stack direction="row" justifyContent="flex-end" spacing={2}>
            <ColorIconButton tooltip="Download">
              <DownloadIcon className="NavbarIcon" />
            </ColorIconButton>

            <Button
              variant="contained"
              color="secondary"
              size="small"
              onClick={handlePublish}
              style={{
                marginTop: 5,
                marginBottom: 5,
                marginRight: 5,
                paddingLeft: 16,
                paddingRight: 16,
              }}
            >
              Publish
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  );
}