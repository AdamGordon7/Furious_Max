import * as THREE from "../modules/three.module.js";
import * as CANNON from "../modules/cannon-es.js";
import * as YUKA from "../modules/yuka.module.js";
import CannonDebugger from "../modules/cannon-es-debugger.js";
import{OrbitControls}from"../modules/OrbitControls.js";
import{GLTFLoader} from "../modules/GLTFLoader.js";
import{ControlsInput} from "/js/controlls.js";
import{Track} from "/js/track.js";


class Class{
    constructor(){
        this.initScene();
    }

    initScene()
    {
        this.scene=new THREE.Scene();

        this.camera=new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);
        this.camera.position.set(0,0,-6);
        this.camera.lookAt(new THREE.Vector3(0,0,0));

        this.renderer=new THREE.WebGLRenderer({antialias:true, alpha:true});
        this.renderer.setSize(window.innerWidth,window.innerHeight);
        this.renderer.outputEncoding=THREE.sRGBEncoding;
        this.renderer.setPixelRatio(window.devicePixelRatio);

        document.body.appendChild(this.renderer.domElement);

        this.carMesh;

        window.addEventListener('resize',this.widnowResize);

        this.loadModel();
        this.initLight();
        this.initOrbitControls();
        this.addTrack();
        this.animate();
    }


    loadModel()
    {
        const loader=new GLTFLoader();
        loader.load("../assets/Cars/ferrari_f175/scene.gltf",(gltf)=>{
            this.carMesh=gltf.scene;
            this.scene.add(this.carMesh);
            this.carMesh.scale.set(0.35,0.35,0.35);
        });
    }

    initLight()
    {
        const AmbientLight=new THREE.AmbientLight();
        this.scene.add(AmbientLight);
    }

    initOrbitControls()
    {
        let Orbcontrols=new OrbitControls(this.camera,this.renderer.domElement);
    }

    addTrack()
    {
        let track=new Track(this.scene);
    }

    animate=()=>
    {
        this.renderer.render(this.scene,this.camera);

        if(this.carMesh)
        {
            this.carMesh.rotateY(0.05*Math.PI/10);
        }
        window.requestAnimationFrame(this.animate);
    }

    //window resize
    widnowResize=()=>
    {
        this.camera.aspect=window.innerWidth/window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth,window.innerHeight);
    }

}

var game=new Class();