import { MutableRefObject, useRef } from "react";
import { Group } from "three";
import { useAvatar, useIpfsFile, useProfile } from "ceramic";
import { Avatar } from "3d";

import { Transform } from "./helpers/types";
import { Identity } from "../../helpers/types";

import useInterpolation from "./hooks/useInterpolation";

const defaultAvatar =
  "kjzl6cwe1jw1495s2wbkxyf0d7a4a5k82980jms3m1utm0yvmaev8s1dhmv20qv";

interface Props {
  id: string;
  identity?: Identity;
  transformRef: MutableRefObject<Transform>;
}

export default function OtherPlayer({ id, identity, transformRef }: Props) {
  const groupRef = useRef<Group>();

  const { profile } = useProfile(identity?.did);
  const { avatar } = useAvatar(profile?.avatar ?? defaultAvatar);
  const { url } = useIpfsFile(avatar?.vrm);
  const animationWeights = useInterpolation(groupRef, transformRef);

  return (
    <group ref={groupRef}>
      {url && (
        <Avatar
          src={url}
          animationsSrc="/models/animations.fbx"
          animationWeights={animationWeights}
        />
      )}
    </group>
  );
}
