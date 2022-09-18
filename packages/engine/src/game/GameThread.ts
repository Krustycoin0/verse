import { RenderThread } from "../render/RenderThread";
import { FromGameMessage, ToGameMessage } from "../types";
import { Player } from "./Player";

export class GameThread {
  #worker = new Worker(new URL("../workers/Game.worker.ts", import.meta.url), {
    type: "module",
  });

  ready = false;
  #readyListeners: Array<() => void> = [];

  #canvas: HTMLCanvasElement;
  #renderThread: RenderThread;

  #player: Player | null = null;

  constructor(canvas: HTMLCanvasElement, renderThread: RenderThread) {
    this.#canvas = canvas;
    this.#renderThread = renderThread;

    this.#worker.onmessage = (event: MessageEvent<FromGameMessage>) => {
      const { subject, data } = event.data;

      switch (subject) {
        case "ready":
          this.ready = true;
          this.#readyListeners.forEach((listener) => listener());
          break;
        case "player_buffers":
          renderThread.setPlayerBuffers(data);
          break;
      }
    };
  }

  waitForReady() {
    const promise: Promise<void> = new Promise((resolve) => {
      this.#readyListeners.push(resolve);
    });
    return promise;
  }

  initPlayer() {
    this.#player = new Player(this.#canvas, this.#renderThread, this);

    this.#postMessage({ subject: "init_player", data: null });
  }

  jump() {
    this.#postMessage({ subject: "jumping", data: true });
  }

  destroy() {
    this.#worker.terminate();
    if (this.#player) this.#player.destroy();
  }

  #postMessage = (message: ToGameMessage) => {
    this.#worker.postMessage(message);
  };
}
