import { useRef, useEffect } from "react";

/**
 * KeyboardMovement gives the player a direction to move by taking
 * input from any source (currently keyboard) and calculating
 * relative direction.
 *
 * Direction is stored as a Vector3 with the following format
 *    x: left/right movement, + for right
 *    y: forward/back movement, + for forwards
 *    z: up/down movement, + for up
 *
 * @param props
 * @constructor
 */
export default function KeyboardMovement(props) {
  const { paused, direction, jump } = props;

  const pressedKeys = useRef([false, false, false, false]);

  // key events
  const calcDirection = () => {
    const press = pressedKeys.current; // [w, a, s, d]
    const yAxis = -1 * Number(press[0]) + Number(press[2]);
    const xAxis = -1 * Number(press[1]) + Number(press[3]);
    return [xAxis, yAxis, 0];
  };

  const onKeyDown = (ev) => {
    if (ev.defaultPrevented) {
      return;
    }

    // We don't want to mess with the browser's shortcuts
    if (ev.ctrlKey || ev.altKey || ev.metaKey) {
      return;
    }

    updatePressedKeys(ev, true);

    const [x, y, z] = calcDirection();
    direction.current.set(x, y, z);
  };

  const onKeyUp = (ev) => {
    updatePressedKeys(ev, false);

    const [x, y, z] = calcDirection();
    direction.current.set(x, y, z);
  };

  const updatePressedKeys = (ev, pressedState) => {
    // We try to use `code` first because that's the layout-independent property.
    // Then we use `key` because some browsers, notably Internet Explorer and
    // Edge, support it but not `code`. Then we use `keyCode` to support older
    // browsers like Safari, older Internet Explorer and older Chrome.
    switch (ev.code || ev.key || ev.keyCode) {
      case "KeyW":
      case "ArrowUp":
      case "Numpad8":
      case 38: // keyCode for arrow up
        pressedKeys.current[0] = pressedState;
        break;
      case "KeyA":
      case "ArrowLeft":
      case "Numpad4":
      case 37: // keyCode for arrow left
        pressedKeys.current[1] = pressedState;
        break;
      case "KeyS":
      case "ArrowDown":
      case "Numpad5":
      case "Numpad2":
      case 40: // keyCode for arrow down
        pressedKeys.current[2] = pressedState;
        break;
      case "KeyD":
      case "ArrowRight":
      case "Numpad6":
      case 39: // keyCode for arrow right
        pressedKeys.current[3] = pressedState;
        break;
      case "Space":
        jump.current = pressedState;
        break;
      default:
        return;
    }
  };

  useEffect(() => {
    if (paused) {
      direction.current.set(0, 0, 0);
      pressedKeys.current = [false, false, false, false];
      return;
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
    };
  }, [paused, onKeyDown, onKeyUp]);

  return <></>;
}
