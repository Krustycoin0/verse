import { Accessor, ExtensionProperty, Mesh, Node, Primitive, WebIO } from "@gltf-transform/core";
import { KHRDracoMeshCompression } from "@gltf-transform/extensions";

import { Engine } from "../Engine";
import { BehaviorExtension, Collider, ColliderExtension, SpawnPointExtension } from "../gltf";
import { extensions } from "../gltf/constants";
import { PhysicsModule } from "../physics/PhysicsModule";
import { RenderModule } from "../render/RenderModule";
import { MaterialJSON } from "./attributes/Materials";
import { MeshJSON } from "./attributes/Meshes";
import { NodeJSON } from "./attributes/Nodes";
import { PrimitiveJSON } from "./attributes/Primitives";
import { SceneMessage } from "./messages";
import { Scene } from "./Scene";

/**
 * Handles scene related logic for the main thread.
 * Syncs changes to the scene with the worker threads.
 *
 * @group modules
 */
export class SceneModule extends Scene {
  #render: RenderModule;
  #physics: PhysicsModule;

  constructor(engine: Engine) {
    super();

    this.#render = engine.render;
    this.#physics = engine.physics;

    this.accessor.addEventListener("create", ({ data }) => {
      const accessor = this.accessor.store.get(data.id);
      if (!accessor) throw new Error("Accessor not found");
      this.#onAccessorCreate(accessor);
    });

    this.primitive.addEventListener("create", ({ data }) => {
      const primitive = this.primitive.store.get(data.id);
      if (!primitive) throw new Error("Primitive not found");
      this.#onPrimitiveCreate(primitive);
    });

    this.mesh.addEventListener("create", ({ data }) => {
      const mesh = this.mesh.store.get(data.id);
      if (!mesh) throw new Error("Mesh not found");
      this.#onMeshCreate(mesh);
    });

    this.node.addEventListener("create", ({ data }) => {
      const node = this.node.store.get(data.id);
      if (!node) throw new Error("Node not found");
      this.#onNodeCreate(node);
    });
  }

  async #createIO() {
    return new WebIO().registerExtensions(extensions).registerDependencies({
      // DracoDecoderModule is a global variable, needs to be set by the user of this library
      // @ts-ignore
      "draco3d.decoder": await new DracoDecoderModule(),
    });
  }

  async export() {
    const io = await this.#createIO();

    // Merge all buffers into one
    const buffers = this.doc.getRoot().listBuffers();
    buffers.forEach((buffer) => buffer.dispose());

    const buffer = this.doc.createBuffer();

    const accessors = this.doc.getRoot().listAccessors();
    accessors.forEach((accessor) => accessor.setBuffer(buffer));

    this.doc
      .getRoot()
      .listExtensionsUsed()
      .forEach((extension) => {
        // Remove extension if it's empty
        if (extension.listProperties().length === 0) {
          extension.dispose();
        }

        // Remove draco compression
        if (extension.extensionName === KHRDracoMeshCompression.EXTENSION_NAME) {
          extension.dispose();
        }
      });

    return await io.writeBinary(this.doc);
  }

  async addBinary(array: Uint8Array) {
    const io = await this.#createIO();
    const doc = await io.readBinary(array);
    await this.addDocument(doc);
  }

  async addFile(file: File) {
    const buffer = await file.arrayBuffer();
    const array = new Uint8Array(buffer);

    const io = await this.#createIO();
    const doc = await io.readBinary(array);

    const scene = doc.getRoot().getDefaultScene();

    const name = file.name.split(".")[0];
    const groupNode = doc.createNode(name);

    // Add top level nodes to group node
    scene?.listChildren().forEach((node) => groupNode.addChild(node));
    scene?.addChild(groupNode);

    // Add physics colliders
    doc
      .getRoot()
      .listNodes()
      .forEach((node) => {
        const mesh = node.getMesh();
        if (!mesh) return;

        const collider = node.getExtension<Collider>(ColliderExtension.EXTENSION_NAME);
        if (collider) return;

        const meshCollider = new Collider(doc.getGraph());
        meshCollider.type = "trimesh";
        meshCollider.mesh = mesh;

        node.setExtension<Collider>(ColliderExtension.EXTENSION_NAME, meshCollider);
      });

    await this.addDocument(doc);
  }

  clear() {
    this.node.store.forEach((node) => node.dispose());
    this.mesh.store.forEach((mesh) => mesh.dispose());
    this.primitive.store.forEach((primitive) => primitive.dispose());
    this.accessor.store.forEach((accessor) => accessor.dispose());
    this.buffer.store.forEach((buffer) => buffer.dispose());
    this.texture.store.forEach((texture) => texture.dispose());
    this.material.store.forEach((material) => material.dispose());

    this.extensions.behavior.dispose();
    this.extensions.collider.dispose();
    this.extensions.spawn.dispose();

    this.extensions = {
      behavior: this.doc.createExtension(BehaviorExtension),
      collider: this.doc.createExtension(ColliderExtension),
      spawn: this.doc.createExtension(SpawnPointExtension),
    };
  }

  override processChanges() {
    this.buffer.processChanges().forEach((buffer) => {
      const id = this.buffer.getId(buffer);
      if (!id) throw new Error("Id not found");
      const json = this.buffer.toJSON(buffer);

      this.#publish({ subject: "create_buffer", data: { id, json } });

      buffer.addEventListener("dispose", () => {
        this.#publish({ subject: "dispose_buffer", data: id });
      });
    });

    this.accessor.processChanges().forEach((accessor) => {
      this.#onAccessorCreate(accessor);
    });

    this.texture.processChanges().forEach((texture) => {
      const id = this.texture.getId(texture);
      if (!id) throw new Error("Id not found");
      const json = this.texture.toJSON(texture);

      this.#render.send({ subject: "create_texture", data: { id, json } });

      texture.addEventListener("dispose", () => {
        this.#render.send({ subject: "dispose_texture", data: id });
      });
    });

    this.material.processChanges().forEach((material) => {
      const id = this.material.getId(material);
      if (!id) throw new Error("Id not found");
      const json = this.material.toJSON(material);

      this.#render.send({ subject: "create_material", data: { id, json } });

      material.addEventListener("change", (e) => {
        const attribute = e.attribute as keyof MaterialJSON;
        const json = this.material.toJSON(material);
        const value = json[attribute];

        this.#render.send({
          subject: "change_material",
          data: { id, json: { [attribute]: value } },
        });
      });

      material.addEventListener("dispose", () => {
        this.#render.send({ subject: "dispose_material", data: id });
      });
    });

    this.primitive.processChanges().forEach((primitive) => {
      this.#onPrimitiveCreate(primitive);
    });

    this.mesh.processChanges().forEach((mesh) => {
      this.#onMeshCreate(mesh);
    });

    this.node.processChanges().forEach((node) => {
      this.#onNodeCreate(node);
    });
  }

  #onAccessorCreate(accessor: Accessor) {
    const id = this.accessor.getId(accessor);
    if (!id) throw new Error("Id not found");

    const json = this.accessor.toJSON(accessor);
    this.#publish({ subject: "create_accessor", data: { id, json } });

    accessor.addEventListener("dispose", () => {
      this.#publish({ subject: "dispose_accessor", data: id });
    });
  }

  #onNodeCreate(node: Node) {
    const id = this.node.getId(node);
    if (!id) throw new Error("Id not found");

    const json = this.node.toJSON(node);
    this.#publish({ subject: "create_node", data: { id, json } });

    let extensionListeners: Array<{ extension: ExtensionProperty; listener: () => void }> = [];

    const setupExtensionListeners = () => {
      // Remove old listeners
      extensionListeners.forEach(({ extension, listener }) => {
        extension.removeEventListener("change", listener);
      });

      // Add new listeners
      extensionListeners = node.listExtensions().map((extension) => {
        const listener = () => {
          const json = this.node.toJSON(node);
          const value = json.extensions;

          this.#publish({ subject: "change_node", data: { id, json: { extensions: value } } });
        };

        extension.addEventListener("change", listener);

        if (extension instanceof Collider) {
          if (extension.type === "trimesh") {
            // Set collider mesh
            const mesh = node.getMesh();
            extension.mesh = mesh;
          }
        }

        return { extension, listener };
      });
    };

    setupExtensionListeners();

    node.addEventListener("change", (e) => {
      const attribute = e.attribute as keyof NodeJSON;
      const json = this.node.toJSON(node);
      const value = json[attribute];

      this.#publish({ subject: "change_node", data: { id, json: { [attribute]: value } } });

      if (attribute === "mesh") {
        // Update mesh collider
        const collider = node.getExtension<Collider>(ColliderExtension.EXTENSION_NAME);

        if (collider?.type === "trimesh") {
          const meshId = value as string | null;

          if (meshId) {
            const mesh = this.mesh.store.get(meshId);
            if (!mesh) throw new Error("Mesh not found");
            collider.mesh = mesh;
          } else {
            collider.mesh = null;
          }
        }
      }

      if (attribute === "extensions") {
        setupExtensionListeners();
      }
    });

    node.addEventListener("dispose", () => {
      this.#publish({ subject: "dispose_node", data: id });
    });
  }

  #onMeshCreate(mesh: Mesh) {
    const id = this.mesh.getId(mesh);
    if (!id) throw new Error("Id not found");

    const json = this.mesh.toJSON(mesh);
    this.#publish({ subject: "create_mesh", data: { id, json } });

    mesh.addEventListener("change", (e) => {
      const attribute = e.attribute as keyof MeshJSON;
      const json = this.mesh.toJSON(mesh);
      const value = json[attribute];

      this.#publish({ subject: "change_mesh", data: { id, json: { [attribute]: value } } });
    });

    mesh.addEventListener("dispose", () => {
      this.#publish({ subject: "dispose_mesh", data: id });
    });
  }

  #onPrimitiveCreate(primitive: Primitive) {
    const id = this.primitive.getId(primitive);
    if (!id) throw new Error("Id not found");

    const json = this.primitive.toJSON(primitive);
    this.#publish({ subject: "create_primitive", data: { id, json } });

    primitive.addEventListener("change", (e) => {
      const attribute = e.attribute as keyof PrimitiveJSON;
      const json = this.primitive.toJSON(primitive);
      const value = json[attribute];

      this.#publish({ subject: "change_primitive", data: { id, json: { [attribute]: value } } });
    });

    primitive.addEventListener("dispose", () => {
      this.#publish({ subject: "dispose_primitive", data: id });
    });
  }

  #publish(message: SceneMessage) {
    this.#render.send(message);
    this.#physics.send(message);
  }
}
