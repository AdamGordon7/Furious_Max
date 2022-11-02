import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js";
import { ColladaLoader } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/ColladaLoader.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/GLTFLoader.js";
let clock, camera, scene, renderer, mixer;

init();
animate();

function init() {
  camera = new THREE.PerspectiveCamera(
    25,
    window.innerWidth / window.innerHeight,
    1,
    10000
  );
  camera.position.set(15, 10, -15);

  scene = new THREE.Scene();
  const loader = new THREE.CubeTextureLoader(); // create new CubeTextureLoader
  loader.load("scenewall.png", function (texture) {
    scene.background = texture;
  });
  //scene.background = new THREE.Color(0xe5e5e5);

  clock = new THREE.Clock();

  const loadingManager = new THREE.LoadingManager(() => {
    const loadingScreen = document.getElementById("loading-screen");
    loadingScreen.classList.add("fade-out");

    // optional: remove loader from DOM via event listener
    loadingScreen.addEventListener("transitionend", onTransitionEnd);
  });

  //
  /************************************************************************ */
  // Load 3d model
  const Gloader = new GLTFLoader(loadingManager); // create instance of GLTF loader

  Gloader.load("Cars/redbull/scene.gltf", (gltf) => {
    // load scene.gltf from models folder, run function
    const car = gltf.scene; // speederMesh object is gltf model
    car.scale.set(0.07, 0.07, 0.07);
    //car.position.set(0, 0.9, 0);

    scene.add(car); // add model to scene
  });
  /************************************************************************ */

  const gridHelper = new THREE.PolarGridHelper(8, 16);
  scene.add(gridHelper);

  //

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(1, 1, -1);
  scene.add(directionalLight);

  //

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  //

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 2, 0);
  controls.update();

  //

  window.addEventListener("resize", onWindowResize, false);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  render();
}

function render() {
  const delta = clock.getDelta();

  if (mixer !== undefined) mixer.update(delta);

  renderer.render(scene, camera);
}

function onTransitionEnd(event) {
  event.target.remove();
}
