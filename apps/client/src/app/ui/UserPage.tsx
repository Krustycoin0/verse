import { IoMdPerson } from "react-icons/io";

import { useSession } from "../../client/auth/useSession";
import LoginButton from "../../home/layouts/NavbarLayout/LoginButton";
import ProfileButton from "../../home/layouts/NavbarLayout/ProfileButton";
import Button from "../../ui/Button";
import ButtonFileInput from "../../ui/ButtonFileInput";
import { useAppStore } from "../store";

export default function UserPage() {
  const playerId = useAppStore((state) => state.playerId);
  const displayName = useAppStore((state) => state.displayName);
  const customAvatar = useAppStore((state) => state.customAvatar);

  const { data: session } = useSession();

  const guestName =
    playerId == null || playerId === undefined
      ? "Guest"
      : `Guest 0x${playerId.toString(16).padStart(2, "0")}`;

  return (
    <div className="space-y-4">
      <div className="flex w-full justify-center">
        <IoMdPerson className="text-5xl" />
      </div>

      <div className="space-y-1">
        <div className="flex justify-center">
          {session?.address ? (
            <ProfileButton fullWidth size="large" />
          ) : (
            <LoginButton fullWidth rounded="large" />
          )}
        </div>
      </div>

      {!session?.address && (
        <div className="space-y-1">
          <input
            type="text"
            placeholder={guestName}
            value={displayName ?? ""}
            onChange={(e) => {
              useAppStore.setState({
                displayName: e.target.value,
                didChangeName: true,
              });
            }}
            className="h-full w-full rounded-xl bg-neutral-200/80 px-3 py-2 text-center outline-none ring-neutral-500/80 transition hover:ring-1 focus:bg-neutral-200 focus:ring-1"
          />
        </div>
      )}

      <div className="space-y-1">
        <ButtonFileInput
          accept=".vrm"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            const blob = new Blob([file], { type: "model/gltf-binary" });
            const url = URL.createObjectURL(blob);

            useAppStore.setState({
              customAvatar: url,
              didChangeAvatar: true,
            });
          }}
        >
          {customAvatar ? "Change Avatar" : "Upload Avatar"}
        </ButtonFileInput>

        {customAvatar && (
          <Button
            color="error"
            rounded="large"
            fullWidth
            onClick={() => {
              useAppStore.setState({
                customAvatar: null,
                didChangeAvatar: true,
              });
            }}
          >
            Remove Avatar
          </Button>
        )}
      </div>
    </div>
  );
}
