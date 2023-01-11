import {
  AmbientLight,
  Fog,
  PCFSoftShadowMap,
  PerspectiveCamera,
  Scene,
  sRGBEncoding,
  Vector2,
  WebGLRenderer,
  WebGLRenderTarget,
} from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { GammaCorrectionShader } from "three/examples/jsm/shaders/GammaCorrectionShader";

import { isInputMessage } from "../input/messages";
import { isSceneMessage } from "../scene/messages";
import { PostMessage } from "../types";
import { OrbitControls } from "./controls/OrbitControls";
import { RaycastControls } from "./controls/RaycastControls";
import { TransformControls } from "./controls/TransformControls";
import { FromRenderMessage, ToRenderMessage } from "./messages";
import { RenderScene } from "./RenderScene";
import { ThreeOutlinePass } from "./three/ThreeOutlinePass";

const CAMERA_NEAR = 0.1;
const CAMERA_FAR = 750;

export class RenderThread {
  #canvas: HTMLCanvasElement | OffscreenCanvas | null = null;
  postMessage: PostMessage<FromRenderMessage>;

  renderer: WebGLRenderer | null = null;
  size = { width: 0, height: 0 };
  pixelRatio = 1;
  camera = new PerspectiveCamera(75, 1, CAMERA_NEAR, CAMERA_FAR);

  outlinePass: ThreeOutlinePass | null = null;
  composer: EffectComposer | null = null;

  renderScene = new RenderScene();
  scene = new Scene();
  raycaster: RaycastControls;
  transform = new TransformControls(this);

  controls = new OrbitControls(this.camera, this.transform);

  constructor(postMessage: PostMessage<FromRenderMessage>) {
    this.postMessage = postMessage;
    this.raycaster = new RaycastControls(
      this.camera,
      this.renderScene,
      this.postMessage,
      this.transform
    );

    this.scene.add(this.renderScene.root);
    this.scene.fog = new Fog(0xcfcfcf, CAMERA_FAR / 2, CAMERA_FAR);

    this.camera.position.set(0, 4, 12);
    this.camera.lookAt(0, 0, 0);

    const light = new AmbientLight(0xffffff, 0.5);
    this.scene.add(light);

    this.render();
  }

  onmessage = (event: MessageEvent<ToRenderMessage>) => {
    this.transform.onmessage(event.data);

    if (isInputMessage(event.data)) {
      this.controls.onmessage(event.data);
      this.raycaster.onmessage(event.data);
    }

    if (isSceneMessage(event.data)) {
      this.renderScene.onmessage(event.data);
    }

    const { subject, data } = event.data;

    switch (subject) {
      case "set_canvas": {
        this.#canvas = data;
        this.init();
        break;
      }

      case "set_size": {
        this.size = data;

        this.camera.aspect = data.width / data.height;
        this.camera.updateProjectionMatrix();

        this.renderer?.setSize(data.width, data.height, false);
        this.controls.setSize(data.width, data.height);
        this.outlinePass?.setSize(data.width, data.height);
        this.composer?.setSize(data.width, data.height);
        break;
      }

      case "set_pixel_ratio": {
        this.pixelRatio = data;
        this.renderer?.setPixelRatio(data);
        break;
      }
    }
  };

  init() {
    if (!this.#canvas) return;

    this.renderer = new WebGLRenderer({
      canvas: this.#canvas,
      antialias: true,
      powerPreference: "high-performance",
      preserveDrawingBuffer: true,
    });

    this.renderer.setPixelRatio(this.pixelRatio);
    this.renderer.setSize(this.size.width, this.size.height, false);
    this.renderer.outputEncoding = sRGBEncoding;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap;

    // Post-processing
    const renderPass = new RenderPass(this.scene, this.camera);
    const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader);

    this.outlinePass = new ThreeOutlinePass(
      new Vector2(this.size.width, this.size.height),
      this.scene,
      this.camera
    );

    const target = new WebGLRenderTarget(this.size.width, this.size.height, {
      encoding: sRGBEncoding,
      samples: 8,
    });

    this.composer = new EffectComposer(this.renderer, target);
    this.composer.addPass(renderPass);
    this.composer.addPass(this.outlinePass);
    this.composer.addPass(gammaCorrectionPass);
  }

  render() {
    requestAnimationFrame(() => this.render());

    this.controls.update();

    this.composer?.render();
  }
}
