import * as THREE from "three";
import autoBind from "auto-bind";
import vertexShader from "../shaders/planeShaders/vertexShader.glsl";
import fragmentShader from "../shaders/planeShaders/fragmentShader.glsl";

export default class {
    constructor(element, scene, camera) {
        this.element = element;
        this.scene = scene;
        this.camera = camera;
        this.target = 0;
        this.current = 0;
        this.scrollOffset = new THREE.Vector2();

        const url = this.element.src;
        const textureLoader = new THREE.TextureLoader();

        textureLoader.crossOrigin = "Anonymous";

        const texture = textureLoader.load(url);

        this.uniforms = {
            tDiffuse: {
                value: texture,
            },
            uScrollOffset: {
                value: new THREE.Vector2(),
            },
            uVelo: {
                value: 0.0,
            },
            vertexShader,
            fragmentShader,
        };

        autoBind(this);

        this.init();
    }

    init() {
        this.addEventListeners();
        this.createMesh();
        this.render();
    }

    addEventListeners() {
        window.addEventListener("resize", this.onResize);
    }

    createMesh() {
        const geometry = new THREE.PlaneBufferGeometry(1, 1, 20, 20);
        const material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader,
            fragmentShader,
        });

        material.needsUpdate = true;

        this.mesh = new THREE.Mesh(geometry, material);

        this.setDimensions();

        this.scene.add(this.mesh);
    }

    setOffsets() {
        const { scrollEvent } = require("./scroll");

        this.target = scrollEvent.target;
        this.current = scrollEvent.current;
    }

    setDimensions() {
        const { width, height } = this.element.getBoundingClientRect();

        this.mesh.scale.set(width, height, 1);
    }

    setPosition() {
        const { width, height, top, left } =
            this.element.getBoundingClientRect();

        this.scrollOffset.set(
            left - window.innerWidth / 2 + width / 2,
            -top + window.innerHeight / 2 - height / 2
        );

        this.mesh.position.set(this.scrollOffset.x, this.scrollOffset.y, 0);
        this.camera.rotation.x = (this.target - this.current) * 0.000001;
        this.camera.position.z = 5 + (this.target - this.current) * 0.0009;
    }

    setUniforms() {
        const { scrollEvent } = require("./scroll");

        this.uniforms.uScrollOffset.value.y =
            -(this.target - this.current) * 0.0003;
        this.uniforms.uVelo.value = scrollEvent.velocity;
    }

    render() {
        this.setOffsets();
        this.setPosition();
        this.setUniforms();

        requestAnimationFrame(this.render);
    }

    onResize() {
        this.setDimensions();
        this.setPosition();
    }
}
