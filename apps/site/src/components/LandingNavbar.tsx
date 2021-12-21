import Link from "next/link";
import { Grid, Button, IconButton, Paper } from "@mui/material";
import TwitterIcon from "@mui/icons-material/Twitter";
import GitHubIcon from "@mui/icons-material/GitHub";
import DiscordIcon from "./DiscordIcon";
import MediumIcon from "./MediumIcon";

import { DISCORD_URL, TWITTER_URL, MEDIUM_URL, GITHUB_URL } from "../constants";

export default function WelcomeNavbar() {
  return (
    <Paper
      square
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        zIndex: 1,
      }}
    >
      <Grid
        container
        className="container"
        style={{
          paddingTop: "0.5vh",
          paddingBottom: "0.5vh",
        }}
      >
        <Grid
          item
          xs={8}
          container
          justifyContent="flex-start"
          columnSpacing={1}
        >
          <Grid item style={{ paddingRight: "8px" }}>
            <IconButton href={TWITTER_URL} target="_blank">
              <TwitterIcon color="primary" />
            </IconButton>
          </Grid>
          <Grid item style={{ paddingRight: "8px" }}>
            <IconButton href={DISCORD_URL} target="_blank">
              <DiscordIcon color="primary" />
            </IconButton>
          </Grid>
          <Grid item style={{ paddingRight: "8px" }}>
            <IconButton href={GITHUB_URL} target="_blank">
              <GitHubIcon color="primary" />
            </IconButton>
          </Grid>
          <Grid item style={{ paddingRight: "8px" }}>
            <IconButton href={MEDIUM_URL} target="_blank">
              <MediumIcon color="primary" />
            </IconButton>
          </Grid>
        </Grid>

        <Grid item xs container justifyContent="flex-end" columnSpacing={1}>
          <Grid item>
            <Button
              href="https://the-wired.gitbook.io/the-wired/"
              target="_blank"
            >
              Docs
            </Button>
          </Grid>
          <Grid item>
            <Link href="/home/login" passHref>
              <Button variant="contained">Login</Button>
            </Link>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}
