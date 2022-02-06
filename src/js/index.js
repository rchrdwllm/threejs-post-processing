import * as THREE from "three";
import autoBind from "auto-bind";
import Plane from "./Plane";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { FilmPass } from "three/examples/jsm/postprocessing/FilmPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import vertexShader from "../shaders/vertexShader.glsl";
import fragmentShader from "../shaders/fragmentShader.glsl";

class EffectShell {
    constructor() {
        this.elements = [...document.querySelectorAll("img")];
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            (180 * (2 * Math.atan(window.innerHeight / 2 / 5))) / Math.PI,
            window.innerWidth / window.innerHeight,
            1,
            1000
        );
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
        });
        this.mouseOffset = new THREE.Vector2();
        this.prevMouse = new THREE.Vector2();
        this.followMouse = new THREE.Vector2();
        this.uniforms = {
            uResolution: {
                value: new THREE.Vector2(
                    1.0,
                    window.innerHeight / window.innerWidth
                ),
            },
            uVelo: { value: 0 },
            uAmount: { value: 0 },
            tDiffuse: { value: null },
            uMouse: { value: new THREE.Vector2() },
        };
        this.time = 0;
        this.mouseSpeed = 0;
        this.targetSpeed = 0;
        this.time = 0;

        autoBind(this);

        this.init();
    }

    init() {
        this.camera.position.z = 5;
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        document.body.appendChild(this.renderer.domElement);

        this.addEventListeners();
        this.createMeshes();
        this.postProcess();
        this.render();
    }

    addEventListeners() {
        window.addEventListener("mousemove", this.onMouseMove);
        window.addEventListener("resize", this.onResize);
    }

    createMeshes() {
        this.elements.forEach((element) => {
            new Plane(element, this.scene, this.camera);
        });
    }

    postProcess() {
        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(new RenderPass(this.scene, this.camera));

        const filmPass = new FilmPass(0.35, 0.025, 648, false);
        filmPass.renderToScreen = true;
        this.composer.addPass(filmPass);

        this.rgbPass = new ShaderPass({
            uniforms: this.uniforms,
            vertexShader,
            fragmentShader,
        });
        this.rgbPass.renderToScreen = true;
        this.composer.addPass(this.rgbPass);
    }

    getSpeed() {
        this.mouseSpeed = Math.sqrt(
            (this.prevMouse.x - this.mouseOffset.x) ** 2 +
                (this.prevMouse.y - this.mouseOffset.y) ** 2
        );

        this.targetSpeed -= 0.1 * (this.targetSpeed - this.mouseSpeed);
        this.followMouse.x -= 0.1 * (this.followMouse.x - this.mouseOffset.x);
        this.followMouse.y -= 0.1 * (this.followMouse.y - this.mouseOffset.y);

        this.targetSpeed = THREE.MathUtils.clamp(this.targetSpeed, 0, 0.05);

        this.prevMouse.x = this.mouseOffset.x;
        this.prevMouse.y = this.mouseOffset.y;
    }

    render() {
        this.time += 0.05;
        this.getSpeed();

        this.rgbPass.uniforms.uMouse.value = this.followMouse;
        this.rgbPass.uniforms.uVelo.value = this.targetSpeed;
        this.rgbPass.uniforms.uAmount.value = this.time;

        this.composer.render();

        requestAnimationFrame(this.render);
    }

    onMouseMove(e) {
        this.mouseOffset.set(
            e.clientX / window.innerWidth,
            1.0 - e.clientY / window.innerHeight
        );
    }

    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

new EffectShell();
