import { PhysicsThread } from "../physics/PhysicsThread";
import { RenderThread } from "../render/RenderThread";

export class InputManager {
  #canvas: HTMLCanvasElement;
  #renderThread: RenderThread;
  #physicsThread: PhysicsThread;

  #pressingW = false;
  #pressingS = false;
  #pressingA = false;
  #pressingD = false;

  #jumpInterval: NodeJS.Timeout | null = null;
  #isLocked = false;

  constructor(canvas: HTMLCanvasElement, renderThread: RenderThread, physicsThread: PhysicsThread) {
    this.#canvas = canvas;
    this.#renderThread = renderThread;
    this.#physicsThread = physicsThread;

    this.#canvas.addEventListener("click", this.#onClick.bind(this));
    document.addEventListener("keydown", this.#onKeyDown.bind(this));
    document.addEventListener("keyup", this.#onKeyUp.bind(this));
    document.addEventListener("pointerlockchange", this.#onPointerLockChange.bind(this));
    document.addEventListener("mousemove", this.#onMouseMove.bind(this));
    document.addEventListener("pointerlockchange", this.#onPointerLockChange.bind(this));
  }

  destroy() {
    this.#canvas.removeEventListener("click", this.#onClick);
    document.removeEventListener("keydown", this.#onKeyDown);
    document.removeEventListener("keyup", this.#onKeyUp);
    document.removeEventListener("pointerlockchange", this.#onPointerLockChange);
    document.removeEventListener("mousemove", this.#onMouseMove);
    document.removeEventListener("pointerlockchange", this.#onPointerLockChange);

    document.exitPointerLock();
  }

  #onClick() {
    this.#canvas.requestPointerLock();
  }

  #onMouseMove(event: MouseEvent) {
    if (!this.#isLocked) return;
    this.#renderThread.mouseMove(event.movementX, event.movementY);
  }

  #onKeyDown(event: KeyboardEvent) {
    const key = event.key.toLowerCase();

    if (event.shiftKey) this.#physicsThread.setSprinting(true);

    switch (key) {
      case "w": {
        this.#pressingW = true;
        this.#updateVelocity();
        break;
      }

      case "s": {
        this.#pressingS = true;
        this.#updateVelocity();
        break;
      }

      case "a": {
        this.#pressingA = true;
        this.#updateVelocity();
        break;
      }

      case "d": {
        this.#pressingD = true;
        this.#updateVelocity();
        break;
      }

      case " ": {
        if (!this.#jumpInterval) {
          // Jump now
          this.#physicsThread.jump();

          // Send a jump command on an interval while the spacebar is held down
          this.#jumpInterval = setInterval(() => {
            this.#physicsThread.jump();
          }, 200);
        }
        break;
      }
    }
  }

  #onKeyUp(event: KeyboardEvent) {
    const key = event.key.toLowerCase();

    if (!event.shiftKey) this.#physicsThread.setSprinting(false);

    switch (key) {
      case "w": {
        this.#pressingW = false;
        this.#updateVelocity();
        break;
      }

      case "s": {
        this.#pressingS = false;
        this.#updateVelocity();
        break;
      }

      case "a": {
        this.#pressingA = false;
        this.#updateVelocity();
        break;
      }

      case "d": {
        this.#pressingD = false;
        this.#updateVelocity();
        break;
      }

      case " ": {
        if (this.#jumpInterval !== null) {
          clearInterval(this.#jumpInterval);
          this.#jumpInterval = null;
        }
        break;
      }
    }
  }

  #onPointerLockChange() {
    this.#isLocked = document.pointerLockElement === this.#canvas;
    if (this.#isLocked) return;

    this.#pressingW = false;
    this.#pressingS = false;
    this.#pressingA = false;
    this.#pressingD = false;
    this.#updateVelocity();

    this.#physicsThread.setSprinting(false);

    if (this.#jumpInterval !== null) {
      clearInterval(this.#jumpInterval);
      this.#jumpInterval = null;
    }
  }

  #updateVelocity() {
    const wForce = this.#pressingW ? 1 : 0;
    const sForce = this.#pressingS ? 1 : 0;
    const aForce = this.#pressingA ? 1 : 0;
    const dForce = this.#pressingD ? 1 : 0;
    const forward = wForce - sForce;
    const right = aForce - dForce;
    const direction: [number, number] = [right, forward];

    // Send direction to render thread
    this.#renderThread.setPlayerInputVector(direction);
  }
}
