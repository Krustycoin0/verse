import { GLTFExporter } from "./exporter/GLTFExporter";
import { LoaderThread } from "./loader/LoaderThread";
import { MainScene } from "./main/MainScene";
import { NetworkingInterface } from "./networking/NetworkingInterface";
import { PhysicsThread } from "./physics/PhysicsThread";
import { RenderThread } from "./render/RenderThread";

export interface EngineOptions {
  canvas: HTMLCanvasElement;
  camera?: "orbit" | "player";
  enableTransformControls?: boolean;
  preserveDrawingBuffer?: boolean;
  skyboxPath?: string;
}

/*
 * A multi-threaded 3D game engine.
 * Uses Web Workers to offload heavy tasks to separate threads.
 */
export class Engine {
  physicsThread: PhysicsThread;
  loaderThread: LoaderThread;
  renderThread: RenderThread;

  scene: MainScene;
  networkingInterface: NetworkingInterface;

  running = false;

  constructor({
    canvas,
    camera = "player",
    enableTransformControls,
    preserveDrawingBuffer,
    skyboxPath,
  }: EngineOptions) {
    // Create render thread
    this.renderThread = new RenderThread({
      canvas,
      engine: this,
      camera,
      enableTransformControls,
      preserveDrawingBuffer,
      skyboxPath,
    });

    // Create physics thread
    this.physicsThread = new PhysicsThread({ canvas, engine: this });

    // Create loader thread
    this.loaderThread = new LoaderThread();

    // Create scene
    this.scene = new MainScene({
      physicsThread: this.physicsThread,
      loaderThread: this.loaderThread,
      renderThread: this.renderThread,
    });

    // Create networking interface
    this.networkingInterface = new NetworkingInterface({
      scene: this.scene,
      renderThread: this.renderThread,
    });

    // Once the threads are ready, create the player
    const createPlayer = async () => {
      await this.renderThread.waitForReady();
      await this.physicsThread.waitForReady();
      this.physicsThread.initPlayer();
    };

    if (camera === "player") createPlayer();
  }

  joinSpace(spaceId: string) {
    if (!this.running) throw new Error("Engine is not running");
    this.networkingInterface.joinSpace(spaceId);
  }

  leaveSpace() {
    this.networkingInterface.leaveSpace();
  }

  async start() {
    await this.physicsThread.waitForReady();
    await this.loaderThread.waitForReady();
    await this.renderThread.waitForReady();

    this.physicsThread.start();
    this.renderThread.start();

    this.running = true;
  }

  stop() {
    this.physicsThread.stop();
    this.renderThread.stop();

    this.running = false;
  }

  async export() {
    // Get scene
    const json = this.scene.toJSON(true);
    const data = await this.renderThread.export();

    // Export as glb
    const exporter = new GLTFExporter();
    const glb = await exporter.parse(json, data);

    return glb;
  }

  destroy() {
    this.physicsThread.destroy();
    this.loaderThread.destroy();
    this.renderThread.destroy();
    this.scene.destroy();
  }
}
