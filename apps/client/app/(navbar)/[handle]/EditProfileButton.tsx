"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { MdEdit } from "react-icons/md";

import {
  MAX_PROFILE_BIO_LENGTH,
  MAX_USERNAME_LENGTH,
  MIN_USERNAME_LENGTH,
} from "@/app/api/auth/profile/constants";
import { updateProfile } from "@/app/api/auth/profile/helper";
import { getProfileUploadURL } from "@/app/api/auth/profile/upload/[file]/helper";
import { ProfileFile } from "@/app/api/auth/profile/upload/[file]/types";
import { useAuth } from "@/src/client/AuthProvider";
import { env } from "@/src/env.mjs";
import { cropImage } from "@/src/studio/utils/cropImage";
import { parseError } from "@/src/studio/utils/parseError";
import Button from "@/src/ui/Button";
import DialogContent, { DialogRoot, DialogTrigger } from "@/src/ui/Dialog";
import ImageInput from "@/src/ui/ImageInput";
import TextArea from "@/src/ui/TextArea";
import { cdnURL, S3Path } from "@/src/utils/s3Paths";

interface Props {
  userId: string;
  username: string;
  bio?: string;
  image?: string;
  background?: string;
}

export default function EditProfileButton({ userId, username, bio, image, background }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageDisplay, setImageDisplay] = useState<string | null>(null);
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
  const [backgroundDisplay, setBackgroundDisplay] = useState<string | null>(null);

  const { user } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (loading) return;

    const form = e.currentTarget;
    const usernameElement = form.elements[2] as HTMLInputElement;
    const bioElement = form.elements[3] as HTMLTextAreaElement;

    async function uploadImage() {
      if (!imageFile) return image;

      try {
        // Get S3 URL
        const { url, fileId } = await getProfileUploadURL(ProfileFile.image);

        // Upload image
        const res = await fetch(url, {
          body: imageFile,
          headers: {
            "Content-Type": imageFile.type,
            "x-amz-acl": "public-read",
          },
          method: "PUT",
        });

        if (!res.ok) throw new Error("Failed to upload image");

        return cdnURL(S3Path.profile(userId).image(fileId));
      } catch (e) {
        console.error(e);
        const message = parseError(e);
        toast.error(message);
      }
    }

    async function uploadBackground() {
      if (!backgroundFile) return background;

      try {
        // Get S3 URL
        const { url, fileId } = await getProfileUploadURL(ProfileFile.background);

        // Upload image
        const res = await fetch(url, {
          body: backgroundFile,
          headers: {
            "Content-Type": backgroundFile.type,
            "x-amz-acl": "public-read",
          },
          method: "PUT",
        });

        if (!res.ok) throw new Error("Failed to upload background");

        return cdnURL(S3Path.profile(userId).background(fileId));
      } catch (e) {
        console.error(e);
        const message = parseError(e);
        toast.error(message);
      }
    }

    setLoading(true);

    try {
      const [imageUrl, backgroundUrl] = await Promise.all([uploadImage(), uploadBackground()]);

      await updateProfile({
        background: backgroundUrl,
        bio: bioElement.value,
        image: imageUrl,
        username: usernameElement.value || username,
      });

      // Refresh the page
      router.refresh();

      // Redirect to the new username
      router.push(`/@${usernameElement.value || username}`);

      // Close the dialog
      setOpen(false);
    } catch (e) {
      console.error(e);
      const message = parseError(e);
      toast.error(message);
    }

    setLoading(false);
  }

  // Only show the button if the user is viewing their own profile
  if (user?.userId !== userId) return null;

  return (
    <DialogRoot open={open} onOpenChange={setOpen}>
      <DialogContent title="Edit Profile">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="w-full">
            <ImageInput
              disabled={loading}
              src={backgroundDisplay || background}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                const fileUrl = URL.createObjectURL(file);
                setBackgroundDisplay(fileUrl);

                // Crop image
                const croppedFile = await cropImage(fileUrl, 4.4444);
                setBackgroundFile(croppedFile);
              }}
              className="h-28 w-full rounded-lg object-cover"
            />
          </div>

          <div className="flex w-full justify-center">
            <div className="z-10 -mt-16 h-32 w-32 rounded-full bg-neutral-200 ring-4 ring-white">
              <ImageInput
                disabled={loading}
                src={imageDisplay || image}
                fallbackKey={username}
                fallbackSize={128}
                size={128}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  const fileUrl = URL.createObjectURL(file);
                  setImageDisplay(fileUrl);

                  // Crop image
                  const croppedFile = await cropImage(fileUrl, 1);
                  setImageFile(croppedFile);
                }}
                className="h-32 w-32 rounded-full object-cover"
              />
            </div>
          </div>

          <label className="block space-y-1">
            <div className="font-bold text-neutral-700">Username</div>

            <div className="flex rounded-lg border border-neutral-200 bg-neutral-100">
              <div className="px-4 py-2 font-bold">
                {new URL(env.NEXT_PUBLIC_DEPLOYED_URL).host}/@
              </div>
              <input
                name="username"
                disabled={loading}
                defaultValue={username}
                placeholder={username}
                minLength={MIN_USERNAME_LENGTH}
                maxLength={MAX_USERNAME_LENGTH}
                className={`w-full rounded-r-lg bg-white px-4 ${loading ? "opacity-70" : ""}`}
              />
            </div>
          </label>

          <TextArea
            name="Bio"
            label="Bio"
            disabled={loading}
            defaultValue={bio}
            placeholder="Say something about yourself..."
            maxLength={MAX_PROFILE_BIO_LENGTH}
          />

          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              Save
            </Button>
          </div>
        </form>
      </DialogContent>

      <DialogTrigger asChild>
        <button
          disabled={loading}
          className="absolute bottom-0 right-0 z-20 rounded-full bg-black p-2 transition hover:bg-neutral-800 active:scale-95"
        >
          <MdEdit className="text-lg text-white" />
        </button>
      </DialogTrigger>
    </DialogRoot>
  );
}
