import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import AuthProvider from "@/src/client/AuthProvider";
import { fetchDatabaseSpaces } from "@/src/server/helpers/fetchLatestSpaces";
import { prisma } from "@/src/server/prisma";
import Avatar from "@/src/ui/Avatar";
import SpaceCard from "@/src/ui/SpaceCard";
import { isFromCDN } from "@/src/utils/isFromCDN";

import EditProfileButton from "./EditProfileButton";

type Params = { handle: string };

interface Props {
  params: Params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const username = params.handle.split("%40")[1]; // Remove the @ from the handle
  if (!username) return {};

  const user = await prisma.authUser.findUnique({
    include: { Profile: true },
    where: { username },
  });

  if (!user) return {};

  const title = `@${username}`;
  const description = user?.Profile?.bio ?? "";
  const image = user?.Profile?.image;

  return {
    description,
    openGraph: {
      description,
      firstName: user?.Profile?.name,
      images: image ? [{ url: image }] : undefined,
      title,
      type: "profile",
      username,
    },
    title,
    twitter: {
      card: image ? "summary_large_image" : "summary",
      description,
      images: image ? [image] : undefined,
      title,
    },
  };
}

export default async function Handle({ params }: Props) {
  const username = params.handle.split("%40")[1]; // Remove the @ from the handle
  if (!username) notFound();

  const [spaces, user] = await Promise.all([
    fetchDatabaseSpaces(20, username),
    prisma.authUser.findUnique({
      include: { Profile: true },
      where: { username },
    }),
  ]);

  if (!user) notFound();

  return (
    <>
      <div className="flex justify-center">
        <div className="max-w-content">
          <div className="h-40 w-full bg-neutral-200 md:h-72 xl:rounded-2xl">
            <div className="relative h-full w-full object-cover">
              {user?.Profile?.background ? (
                isFromCDN(user.Profile.background) ? (
                  <Image
                    src={user.Profile.background}
                    priority
                    fill
                    sizes="100vw"
                    alt=""
                    className="h-full w-full object-cover xl:rounded-2xl"
                  />
                ) : (
                  <img
                    src={user.Profile.background}
                    sizes="100vw"
                    alt=""
                    className="h-full w-full object-cover xl:rounded-2xl"
                    crossOrigin="anonymous"
                  />
                )
              ) : null}
            </div>
          </div>

          <section className="flex justify-center px-4 md:px-0">
            <div className="flex w-full flex-col items-center space-y-2">
              <div className="relative z-10 -mt-16 flex w-32 rounded-full ring-4 ring-white">
                <Avatar src={user?.Profile?.image} circle uniqueKey={username} size={128} />

                <AuthProvider>
                  <EditProfileButton
                    userId={user.id}
                    username={user.username}
                    bio={user.Profile?.bio ?? undefined}
                    image={user.Profile?.image ?? undefined}
                    background={user.Profile?.background ?? undefined}
                  />
                </AuthProvider>
              </div>

              <div className="flex w-full flex-col items-center space-y-2">
                <div className="text-2xl font-bold">@{username}</div>
                <div className="w-full overflow-x-hidden text-ellipsis text-center text-neutral-400">
                  {user?.address}
                </div>
              </div>

              {user?.Profile?.bio && (
                <div className="w-full whitespace-pre-line text-center">{user.Profile.bio}</div>
              )}
            </div>
          </section>
        </div>
      </div>

      <div className="flex justify-center pb-8 pt-4">
        <div className="max-w-content mx-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {spaces.map(({ id, uri, metadata }) => (
            <SpaceCard
              key={id.value}
              id={id}
              uri={uri}
              metadata={metadata}
              sizes="(min-width: 1320px) 33vw, (min-width: 768px) 50vw, 100vw"
            />
          ))}
        </div>
      </div>
    </>
  );
}
