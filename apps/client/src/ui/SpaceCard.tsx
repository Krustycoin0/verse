import { WorldMetadata } from "@wired-protocol/types";
import Link from "next/link";

import PlayerCount from "@/app/(navbar)/PlayerCount";

import { env } from "../env.mjs";
import { SpaceId } from "../utils/parseSpaceId";
import { toHex } from "../utils/toHex";
import { CardImage } from "./Card";
import Tooltip from "./Tooltip";

interface Props {
  id: SpaceId;
  uri: string;
  metadata: WorldMetadata;
  tokenId?: number;
  sizes?: string;
}

/**
 * Wrapper around {@link Card} that links to the space page, and shows the player count.
 */
export default function SpaceCard({ id, uri, metadata, tokenId, sizes }: Props) {
  return (
    <div>
      <div className="group relative">
        <Link
          href={id.type === "tokenId" ? `/space/${toHex(id.value)}` : `/space/${id.value}`}
          className="rounded-3xl"
        >
          <CardImage group image={metadata.info?.image} sizes={sizes}>
            <PlayerCount uri={uri} host={metadata.info?.host || env.NEXT_PUBLIC_DEFAULT_HOST} />
          </CardImage>

          <div className="absolute bottom-0 z-10 h-full w-full rounded-b-3xl bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition duration-100 ease-out group-hover:scale-105 group-hover:opacity-100" />
        </Link>

        <div className="absolute bottom-0 left-0 z-20 mb-4 ml-3 hidden animate-fadeIn group-hover:block">
          <Link
            href={
              id.type === "tokenId" ? `/play?tokenId=${toHex(id.value)}` : `/play?id=${id.value}`
            }
            className="rounded-xl bg-white px-4 py-1.5 text-xl font-bold shadow transition hover:bg-neutral-200 hover:shadow-md active:bg-neutral-300"
          >
            Play
          </Link>
        </div>
      </div>

      <div className="space-x-2 pb-1 pt-2.5">
        {tokenId !== undefined ? (
          <Tooltip text="Space is published to the blockchain as an NFT" delayDuration={200}>
            <span className="w-fit cursor-default rounded-full border border-sky-700/40 bg-sky-100 px-2 text-sm text-sky-700">
              NFT
            </span>
          </Tooltip>
        ) : null}

        <span className="text-xl font-bold text-neutral-900">{metadata.info?.name}</span>
      </div>
    </div>
  );
}
