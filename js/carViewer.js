import * as THREE from "../modules/three.module.js";
import * as CANNON from "../modules/cannon-es.js";
import * as YUKA from "../modules/yuka.module.js";
import CannonDebugger from "../modules/cannon-es-debugger.js";
import{OrbitControls}from"../modules/OrbitControls.js";
import{GLTFLoader} from "../modules/GLTFLoader.js";
import{ControlsInput} from "/js/controlls.js";
import{Track} from "/js/track.js";


class Car{
    constructor(car_val)
    {
        this.car;
        if(car_val==0)
        {
            this.car="ferrari";
        }
        else if(car_val==1)
        {
            this.car="redbull"
        }
        else
        {
            this.car="mclaren";
        }
    }

    getCarType()
    {
        return this.car;
    }
}


let scene, renderer, camera;


//setUpListners();

let car;


function initWorld()
{
    scene=new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);
    camera.position.set(0,0,-5);

    renderer=new THREE.WebGLRenderer({antialias:true, alpha:true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding=THREE.sRGBEncoding;
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);
    setUpOrbitCont();
    initLight();
    animate();

}

function setUpListners()
{

    var ferrariCar=document.getElementById("ferrari");
    ferrariCar.addEventListener("dblclick",function (event){
        ferrariCar.style.backgroundColor="#dcedd6a1";
        car= new Car(0);
        initWorld();
        loadModel();
    });

    var redbull=document.getElementById("redbull");
    redbull.addEventListener("dblclick",function onclick(event){
        redbull.style.backgroundColor="#dcedd6a1";
        car= new Car(1);
        initWorld();
        loadModel();
    });

    var mclaren=document.getElementById("mclaren");
    mclaren.addEventListener("dblclick",function onclick(event){
        mclaren.style.backgroundColor="#dcedd6a1";
        car= new Car(2);
        initWorld();
        loadModel();
    });


}


function loadModel()
{
    const gltfLoader=new GLTFLoader();

    if(car.getCarType()=="ferrari")
    {
        gltfLoader.load("../assets/Cars/ferrari_f175/scene.gltf",(gltf)=>{
            const carMesh=gltf.scene;
            scene.add(carMesh);
            carMesh.scale.set(0.35,0.35,0.35);
        });
    }
    else if(car.getCarType()=="redbull")
    {
        gltfLoader.load("../assets/Cars/redbull/scene.gltf",(gltf)=>{
            const carMesh=gltf.scene;
            scene.add(carMesh);
            carMesh.scale.set(0.01,0.01,0.01);
        });

    }
    else if(car.getCarType()=="mclaren")
    {
        gltfLoader.load("../assets/Cars/mclaren_mcl35/scene.gltf",(gltf)=>{
            const carMesh=gltf.scene;
            scene.add(carMesh);
            carMesh.scale.set(0.6,0.6,0.6);
        });

    }

}

function animate()
{
    renderer.render(scene,camera);
    requestAnimationFrame(animate);
}

function setUpOrbitCont()
{
    let Orbcontrols=new OrbitControls(camera,renderer.domElement);
}

function initLight()
{
    let AmbientLight=new THREE.AmbientLight();
    scene.add(AmbientLight);
}