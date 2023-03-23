import { useEffect, useState } from "react";

import { usePlayStore } from "../../../app/play/[id]/store";
import { PlayerName } from "../networking/PlayerName";

export function usePlayerName(playerId: number | null) {
  const players = usePlayStore((state) => state.players);

  const [player, setPlayer] = useState<PlayerName | null>(null);

  useEffect(() => {
    if (!players || playerId === null) return;

    const player = players.names.get(playerId) ?? null;
    setPlayer(player);

    return () => {
      setPlayer(null);
    };
  }, [playerId, players]);

  return player;
}
