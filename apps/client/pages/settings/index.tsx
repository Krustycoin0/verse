import { nanoid } from "nanoid";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import Button from "../../src/components/base/Button";
import FileUpload from "../../src/components/base/FileUpload";
import TextArea from "../../src/components/base/TextArea";
import TextField from "../../src/components/base/TextField";
import { getSettingsLayout } from "../../src/components/layouts/SettingsLayout/SettingsLayout";
import MetaTags from "../../src/components/ui/MetaTags";
import { uploadFileToIpfs } from "../../src/helpers/ipfs/fetch";
import { createProfileMetadata } from "../../src/helpers/lens/createProfileMetadata";
import { useMediaImage } from "../../src/helpers/lens/hooks/useMediaImage";
import { useProfileByHandle } from "../../src/helpers/lens/hooks/useProfileByHandle";
import { useSetProfileMetadata } from "../../src/helpers/lens/hooks/useSetProfileMetadata";
import { useSetProfilePicture } from "../../src/helpers/lens/hooks/useSetProfilePicture";
import { useLensStore } from "../../src/helpers/lens/store";
import {
  AttributeData,
  MetadataVersions,
  ProfileMetadata,
} from "../../src/helpers/lens/types";
import { crop } from "../../src/helpers/utils/crop";

export default function Settings() {
  const nameRef = useRef<HTMLInputElement>(null);
  const bioRef = useRef<HTMLTextAreaElement>(null);
  const locationRef = useRef<HTMLInputElement>(null);
  const websiteRef = useRef<HTMLInputElement>(null);
  const twitterRef = useRef<HTMLInputElement>(null);
  const hostRef = useRef<HTMLInputElement>(null);

  const [pfpRawFile, setPfpRawFile] = useState<File>();
  const [pfpFile, setPfpFile] = useState<File>();
  const [pfpUrl, setPfpUrl] = useState<string>();
  const [coverFile, setCoverFile] = useState<File>();
  const [coverUrl, setCoverUrl] = useState<string>();
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingProfilePicture, setLoadingProfilePicture] = useState(false);

  const handle = useLensStore((state) => state.handle);
  const profile = useProfileByHandle(handle);
  const pfpMediaUrl = useMediaImage(profile?.picture);
  const coverMediaUrl = useMediaImage(profile?.coverPicture);

  const setProfileMetadata = useSetProfileMetadata(profile?.id);
  const setProfilePicture = useSetProfilePicture(profile?.id);

  useEffect(() => {
    setPfpUrl(pfpMediaUrl);
  }, [pfpMediaUrl]);

  useEffect(() => {
    setCoverUrl(coverMediaUrl);
  }, [coverMediaUrl]);

  useEffect(() => {
    if (!pfpRawFile) return;

    crop(URL.createObjectURL(pfpRawFile), 1).then((res) => {
      setPfpFile(res);
    });
  }, [pfpRawFile]);

  useEffect(() => {
    if (!pfpFile) return;
    setPfpUrl(URL.createObjectURL(pfpFile));
  }, [pfpFile]);

  useEffect(() => {
    if (coverFile) setCoverUrl(URL.createObjectURL(coverFile));
  }, [coverFile]);

  async function handleProfileSave() {
    if (!profile || loadingProfile) return;

    setLoadingProfile(true);

    const { metadata, updateAttribute } = createProfileMetadata(profile);

    if (coverFile) {
      const uri = await uploadFileToIpfs(coverFile);
      metadata.cover_picture = uri;
    }

    updateAttribute("location", locationRef.current?.value);
    updateAttribute("website", websiteRef.current?.value);
    updateAttribute("twitter", twitterRef.current?.value);
    updateAttribute("host", hostRef.current?.value);

    metadata.name = nameRef.current?.value ?? null;
    metadata.bio = bioRef.current?.value ?? null;

    try {
      await setProfileMetadata(metadata);
    } catch (err) {
      console.error(err);
    }

    setLoadingProfile(false);
  }

  async function handleProfilePictureSave() {
    if (!pfpFile || loadingProfilePicture) return;

    setLoadingProfilePicture(true);

    try {
      await setProfilePicture(pfpFile);
    } catch (err) {
      console.error(err);
    }

    setLoadingProfilePicture(false);
  }

  const twitter = profile?.attributes?.find((item) => item.key === "twitter");
  const website = profile?.attributes?.find((item) => item.key === "website");
  const location = profile?.attributes?.find((item) => item.key === "location");
  const host = profile?.attributes?.find((item) => item.key === "host");

  return (
    <>
      <MetaTags title="Settings" />

      {profile && (
        <div className="space-y-8">
          <div className="p-8 space-y-8 rounded-3xl bg-primaryContainer text-onPrimaryContainer">
            <div className="text-lg space-y-4">
              <div className="flex items-center space-x-4">
                <div className="font-bold">Profile ID:</div>
                <div>{profile.id}</div>
              </div>

              <TextField
                inputRef={nameRef}
                title="Name"
                defaultValue={profile?.name ?? ""}
              />

              <TextArea
                textAreaRef={bioRef}
                title="Bio"
                defaultValue={profile?.bio ?? ""}
              />

              <TextField
                inputRef={locationRef}
                title="Location"
                defaultValue={location?.value}
              />

              <TextField
                inputRef={websiteRef}
                title="Website"
                defaultValue={website?.value}
              />

              <TextField
                inputRef={twitterRef}
                title="Twitter"
                frontAdornment="@"
                defaultValue={twitter?.value}
              />

              <div className="space-y-4">
                <div className="text-lg font-bold">Cover</div>

                {coverUrl && (
                  <div className="w-full h-40">
                    <div className="relative object-cover w-full h-full">
                      <Image
                        src={coverUrl}
                        layout="fill"
                        alt="cover picture preview"
                        objectFit="cover"
                        className="rounded-xl h-full w-full"
                      />
                    </div>
                  </div>
                )}

                <FileUpload
                  title="Cover Picture"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setCoverFile(file);
                  }}
                />
              </div>

              <TextField
                inputRef={hostRef}
                title="Host Server"
                help="Host server for your spaces. Can be ignored if you don't have any spaces."
                defaultValue={host?.value}
              />
            </div>

            <div className="w-full flex justify-end">
              <Button
                variant="filled"
                onClick={handleProfileSave}
                loading={loadingProfile}
              >
                Save
              </Button>
            </div>
          </div>

          <div className="p-8 space-y-8 rounded-3xl bg-primaryContainer text-onPrimaryContainer">
            <div className="space-y-4 text-lg">
              <div className="font-bold">Profile Picture</div>

              {pfpUrl && (
                <div className="grid grid-cols-2 gap-x-16">
                  <div className="relative w-full h-full aspect-square">
                    <Image
                      src={pfpUrl}
                      layout="fill"
                      alt="profile picture preview square"
                      objectFit="cover"
                      className="rounded-xl h-full w-full"
                    />
                  </div>

                  <div className="relative w-full h-full aspect-square">
                    <Image
                      src={pfpUrl}
                      layout="fill"
                      alt="profile picture preview circle"
                      objectFit="cover"
                      className="rounded-full h-full w-full"
                    />
                  </div>
                </div>
              )}

              <div>
                <FileUpload
                  title="Profile Picture"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setPfpRawFile(file);
                  }}
                />
              </div>
            </div>

            <div className="w-full flex justify-end">
              <Button
                variant="filled"
                onClick={handleProfilePictureSave}
                loading={loadingProfilePicture}
                disabled={!pfpFile}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

Settings.getLayout = getSettingsLayout;