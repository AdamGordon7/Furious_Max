import * as THREE from "../modules/three.module.js";
import * as CANNON from "../modules/cannon-es.js";
import * as YUKA from "../modules/yuka.module.js";
import * as SkeletonUtils from "/node_modules/three/examples/jsm/utils/SkeletonUtils.js";
import CannonDebugger from "../modules/cannon-es-debugger.js";
import{OrbitControls}from"../modules/OrbitControls.js";
import{GLTFLoader} from "../modules/GLTFLoader.js";
import{ControlsInput} from "/js/controlls.js";
import{Track} from "/js/track.js";
import{Car} from "/js/car.js";
import{Ground} from "/js/ground.js";
import { Water } from "/node_modules/three/examples/jsm/objects/Water.js";
import { Building } from "./buildings.js";
import { SceneHandler } from "./scene.js";
import { DesertAI } from "./desertAI.js";


export class Barrier{
    constructor(scene, cannonWorld)
    {
        this.scene=scene;
        this.cannonWorld=cannonWorld;
    }


    normalBarrier(xPos,yPos,zPos, xSize,zSize)
    {

        //THREE texture
        const textureLoader=new THREE.TextureLoader();
        const barrierTexture=textureLoader.load('../assets/textures/barrier_texture.jpg')
        //three 
        this.barrierGeometry=new THREE.PlaneGeometry(xSize,zSize);
        this.barrierMaterial=new THREE.MeshStandardMaterial({
            map: barrierTexture,
            side:THREE.DoubleSide,
        });

        this.barrierMesh=new THREE.Mesh(this.barrierGeometry,this.barrierMaterial);
        this.scene.add(this.barrierMesh);

        //PHYS
        this.barrierMaterialPhys=new CANNON.Material();
        this.barrierBody=new CANNON.Body({
            material: this.barrierMaterialPhys,
            shape: new CANNON.Box(new CANNON.Vec3(xSize/2,zSize/2,0.1)),
        });

        this.cannonWorld.addBody(this.barrierBody);
        this.barrierBody.quaternion.setFromEuler(0,Math.PI/2,-Math.PI/2);
        this.barrierBody.position.set(xPos,yPos,zPos);

    }

    fuseNormalBarrier()
    {
        this.barrierMesh.position.copy(this.barrierBody.position);
        this.barrierMesh.quaternion.copy(this.barrierBody.quaternion);
    }

    lowFenceBarrier()
    {

    }

    highFenceBarrier()
    {

        this.highFenceMaterialPhys=new CANNON.Material();
        this.highFenceBody=new CANNON.Body({
            material:this.highFenceMaterialPhys,
            shape:new CANNON.Box(new CANNON.Vec3(11,6,3)),
            position:new CANNON.Vec3(-25,6,0),
            //mass:10000000
        });

        this.highFenceBody.quaternion.setFromEuler(0,Math.PI/2,0);
        this.cannonWorld.addBody(this.highFenceBody);

        const loader=new GLTFLoader()
        loader.load("../assets/fences/high_fence.glb",(gltf)=>{
            var mesh=gltf.scene;
            mesh.position.x=this.highFenceBody.position.x-12;
            mesh.position.y=this.highFenceBody.position.y-3;
            mesh.position.z=this.highFenceBody.position.z+19;
            mesh.quaternion.copy(this.highFenceBody.quaternion);
            mesh.scale.set(5,5,5);
            this.scene.add(mesh);
        });
    }
}