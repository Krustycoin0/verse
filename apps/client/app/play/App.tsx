"use client";

import { Client } from "@unavi/react-client";
import { WorldMetadata } from "@wired-protocol/types";
import Script from "next/script";
import { useState } from "react";
import { useProvider, useSigner } from "wagmi";

import { env } from "@/src/env.mjs";
import { useHotkeys } from "@/src/play/hooks/useHotkeys";

import ClientApp from "./ClientApp";
import { SpaceUriId } from "./types";

interface Props {
  id: SpaceUriId;
  metadata: WorldMetadata;
}

export default function App({ id, metadata }: Props) {
  const [scriptsReady, setScriptsReady] = useState(false);

  const provider = useProvider();
  const { data: signer } = useSigner();

  useHotkeys();

  return (
    <>
      <Script src="/scripts/draco_decoder.js" onReady={() => setScriptsReady(true)} />

      <div className="fixed h-screen w-screen">
        {scriptsReady && (
          <Client
            uri={metadata.model}
            host={metadata.info?.host || env.NEXT_PUBLIC_DEFAULT_HOST}
            animations="/models"
            defaultAvatar="/models/Robot.vrm"
            ethers={signer ?? provider}
            skybox="/images/Skybox.jpg"
          >
            <ClientApp id={id} metadata={metadata} />
          </Client>
        )}
      </div>
    </>
  );
}
