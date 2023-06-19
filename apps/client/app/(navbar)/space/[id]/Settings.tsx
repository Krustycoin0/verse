import { WorldMetadata } from "@wired-protocol/types";

import AuthProvider from "@/src/client/AuthProvider";
import { getUserSession } from "@/src/server/auth/getUserSession";
import { SpaceId } from "@/src/utils/parseSpaceId";

import RainbowkitWrapper from "../../RainbowkitWrapper";
import Delete from "./Delete";

interface Props {
  id: SpaceId;
  metadata: WorldMetadata;
}

export default async function Settings({ id, metadata }: Props) {
  const session = await getUserSession();
  if (!session?.user.address) return null;

  return (
    <AuthProvider>
      <RainbowkitWrapper>
        <Delete id={id} />
      </RainbowkitWrapper>
    </AuthProvider>
  );
}
