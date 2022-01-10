import { MatrixClient, IRoomDirectoryOptions } from "matrix-js-sdk";
import { Visibility } from "matrix-js-sdk/lib/@types/partials";
import { getRoomTopic, ROOM_TOPIC, WORLD_TOPIC } from "./topics";

//create
export async function createRoom(
  client: MatrixClient,
  worldId: string,
  name: string
) {
  const room = await client.createRoom({
    name,
    topic: `${ROOM_TOPIC}#${worldId}`,
    visibility: Visibility.Public,
  });

  return room;
}

export async function createWorld(client: MatrixClient, name: string) {
  const room = await client.createRoom({
    name,
    topic: WORLD_TOPIC,
    visibility: Visibility.Public,
  });

  return room;
}

//get
export async function getWorlds(client: MatrixClient) {
  const options: IRoomDirectoryOptions = {
    filter: { generic_search_term: WORLD_TOPIC },
  };
  const rooms = await client.publicRooms(options);
  return rooms.chunk;
}

export async function getPublicRooms(client: MatrixClient) {
  const options: IRoomDirectoryOptions = {
    filter: { generic_search_term: ROOM_TOPIC },
  };
  const rooms = await client.publicRooms(options);
  return rooms.chunk;
}

export async function getWorldInstances(client: MatrixClient, worldId: string) {
  const options: IRoomDirectoryOptions = {
    filter: { generic_search_term: getRoomTopic(worldId) },
  };
  const rooms = await client.publicRooms(options);
  return rooms.chunk;
}

export async function getRoom(
  client: MatrixClient,
  roomId: string,
  world: boolean = false
) {
  const options: IRoomDirectoryOptions = {
    filter: { generic_search_term: world ? WORLD_TOPIC : ROOM_TOPIC },
  };
  const rooms = await client.publicRooms(options);

  const room = rooms.chunk.filter((room) => room.room_id === roomId);
  return room[0];
}