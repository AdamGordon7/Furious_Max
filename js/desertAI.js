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
import { SceneHandler } from "./scene.js";

export class DesertAI{

    constructor(scene)
    {
        this.scene=scene;
        this.entityManager=new YUKA.EntityManager();
        this.ferrariAI();
    }


    ferrariAI()
    {
        //declare AI veichle 
        const ferrariAI=new YUKA.Vehicle();

        //declare path to follow
        const path=new YUKA.Path();

        //add way points to path
        path.add(new YUKA.Vector3( -16.281841605619828, 1.1499991647677723, 452.8057856141562));
        path.add(new YUKA.Vector3(153.26951260771588, 1.1499989394961154, 734.1844707127601));
        path.add(new YUKA.Vector3(1340.8560632011333, 1.1499985920311762, 744.5211381306152));

        

        //dosent stop at last checkpoint -> can do multilpe laps
        path.loop=true;

        //place veichle at first checkpoint on path
        //ferrariAI.position.copy(path.current());
        //max speed
        ferrariAI.maxSpeed=50;

        //set behaviur 
        const followPathBehavior=new YUKA.FollowPathBehavior(path, 0.5);
        ferrariAI.steering.add(followPathBehavior);

        //on path behaviour 
        //sticks better to path
        const onPathBehavior=new YUKA.OnPathBehavior(path);
        //how well it sticks to path
        onPathBehavior.radius=2;
        ferrariAI.steering.add(onPathBehavior)

        //enity manager-handle update state of game
        this.entityManager.add(ferrariAI);
        const gLoader=new GLTFLoader();
        
        gLoader.load('../assets/Cars/ferrari_f175/scene.gltf',(gltf)=>{
            const carMeshAI=gltf.scene;
            this.scene.add(carMeshAI);

            //let YUKA hdnale transforms
            carMeshAI.matrixAutoUpdate=false;
            ferrariAI.position=new YUKA.Vector3(15, 0, 0);
            //fuse body and mind
            ferrariAI.setRenderComponent(carMeshAI,this.syncAIFerrari)
        });
    }

    syncAIFerrari(entity, renderComponent)
    {
        //copy all matrix transforms
        //yuka will now handle animation of mesh, not threejs
        renderComponent.matrix.copy(entity.worldMatrix);

    }

    //update AI with time delta from animate loop in scene
    updateAI(deltaAI)
    {
        console.log("AI UPDATED")
        this.entityManager.update(deltaAI);
    }

}