import { ClientContext } from "@unavi/react-client";
import { useContext, useEffect, useState } from "react";

import { usePlayStore } from "@/app/play/store";
import { useAuth } from "@/src/client/AuthProvider";

import { toHex } from "../../utils/toHex";

export function usePlayerName(playerId: number | null) {
  const [name, setName] = useState("");
  const { players, playerId: userId } = useContext(ClientContext);

  const userNickname = usePlayStore((state) => state.nickname);
  const { user } = useAuth();

  useEffect(() => {
    if (playerId === null) {
      setName("");
      return;
    }

    async function getName() {
      if (playerId === null) return;

      let displayName = "";

      // If this is the current user
      if (playerId === userId) {
        if (user?.username) displayName = `@${user.username}`;
        else if (userNickname) displayName = userNickname;
        else displayName = `Guest ${toHex(playerId)}`;

        setName(displayName);
        return;
      }

      // Otherwise, find the player
      const player = players.find((p) => p.id === playerId);
      if (player) setName(player.displayName);
    }

    getName();
  }, [playerId, players, user, userId, userNickname]);

  return name;
}
