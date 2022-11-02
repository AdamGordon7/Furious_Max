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
import { Barrier } from "./barrier.js";
import { Timer } from "./timer.js";

export class SceneDesert
{
    constructor(carChoice,controlType)
    {
        this.init(carChoice,controlType);
    }

    init(carChoice, controlType)
    {
        this.timer= new Timer();
        this.sceneHandler=new SceneHandler();
        this.carChoice=carChoice;
        this.setUpScene();
        this.setUpCannon();

        this.controlType(controlType)
        this.initLights();
        this.createAssets()


        const pauseButton = document.getElementById("pause-button");
        pauseButton.addEventListener("click", ()=>{
                this.animate();
            });
        const restartBtn=document.getElementById("restart-button");
        restartBtn.addEventListener("click", ()=>{
            this.restartScene(carChoice,controlType);
        });

        const pauseOutOfBounds=document.getElementById("restart-button-out-bounds").addEventListener("click", ()=>{
            document.querySelector(".in-game-menu-container-outer").style.display="flex"
            document.getElementById("out-of-bounds-menu").style.display="none";
            this.restartScene(carChoice,controlType);
        });
        
        // document.getElementById("quit-button-out-bounds").addEventListener("click", function(event){
          
        // });
    }

    createAssets()
    {

        this.addGrandStand();
        this.addSphynx();
        this.addStatues();
        this.addPalace();
        this.addCar();
        this.addTrack();
        this.addGround();
        this.addPyramids();
        this.time=new YUKA.Time();
        //this.ferrariAI=new DesertAI(this.scene);
        this.addBarriers();
        this.animate();
    }


    setUpScene()
    {
        
        //scene instance
        this.scene=new THREE.Scene();

        //add skybox
        
        this.scene.background=new THREE.CubeTextureLoader()
        .setPath("../assets/skyboxSunset/")
        .load([
            "lf.jpg", //pos x 
            "rt.jpg", //neg x 
            "up.jpg", //pos y 
            "dn.jpg", //neg y
            "ft.jpg", //pos z
            "bk.jpg" //neg z
        ]);
       
        //camera +camera settings
        if(this.carChoice!="redbull")
        {
            this.camera=new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.01,10000);
        }
        else
        {
            this.camera=new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.01,100000);
        }
        this.camera.position.set(0,4,-10);


        //renderer +renderer settings
        this.renderer=new THREE.WebGLRenderer({antialias:true, alpha:true,setDepthTest:true});
        this.renderer.setSize(window.innerWidth,window.innerHeight);
        this.renderer.outputEncoding=THREE.sRGBEncoding;
        this.renderer.setPixelRatio(window.devicePixelRatio);
        //enable shadow map
        this.renderer.shadowMap.enabled=true;
        this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;

        //add to body
        document.body.appendChild(this.renderer.domElement);
        //set window resizer
        window.addEventListener('resize',this.widnowResize);

        this.clock=new THREE.Clock();
        this.delta=this.clock.getDelta();
        this.controller=new ControlsInput(this.delta, this.timer, this.sceneHandler);

        this.view=new THREE.Vector3();

        this.control;
    }

    minimap()
    {
        var viewSize = 18;
        var aspectRatio = window.innerWidth/window.innerHeight;
        this.orthoCam= new THREE.OrthographicCamera(-aspectRatio * viewSize /2,aspectRatio * viewSize /2, viewSize /2,-viewSize /2,-1000,1000);           			
        this.scene.add(this.orthoCam);

        
    }

    setUpCannon()
    {
        //cannon world to use physics 
        this.cannonWorld=new CANNON.World();
        this.cannonWorld.gravity.set(0,-9.8,0); //set gravity on y axis

        //start cannon debugger
        this.cannonDebugger=new CannonDebugger(this.scene,this.cannonWorld,{
            color: 0xffffff, //wireframe colour
            scale: 1.0, //wireframe scale ensures same size as bodies in physics world
        });
    }

    controlType(type)
    {
        if(type=="3")
        {
            this.control="3";
            this.initChaseCam();
        }
        else if(type=="orbit")
        {
            this.initOrbitControls();
            this.control="orbit";
        }
        else if(type=="1")
        {

            this.control="1";
        }
    }

    //add lights to scene
    initLights()
    {
        //ambient lighting
        const AmbientLight=new THREE.AmbientLight();
        this.scene.add(AmbientLight);

        //spot light for shadow
        const spotLight = new THREE.SpotLight( 0xffffff );
        spotLight.position.set( 0, 1000, 3000 );

        spotLight.castShadow = true;

        spotLight.shadow.mapSize.width = 1024*6;
        spotLight.shadow.mapSize.height = 1024*6;

        spotLight.shadow.camera.near = 10;
        spotLight.shadow.camera.far = 10000;
        spotLight.shadow.camera.fov = 70;

        this.scene.add( spotLight );
        
    }


    addGround()
    {
        this.ground=new Ground(this.scene,this.cannonWorld,"ground");
        this.ground.createDesertGround(0,-1,0, 8000,8000);
    }

    addTrack()
    {
        let track=new Track(this.scene,this.cannonWorld,3);
    }

    addBarriers()
    {
        this.normalBarrier=new Barrier(this.scene,this.cannonWorld);
        this.normalBarrier.normalBarrier(-30,0,0, 5,1000);

        this.highFence=new Barrier(this.scene,this.cannonWorld);
        this.highFence.highFenceBarrier();
    }

    addCar()
    {
        this.car;
        this.car=new Car(this.scene, this.cannonWorld,this.camera,this.chaseCam,this.control,this.carChoice,this.sceneHandler,2);

       if(this.control=="3")
       {
            if(this.car.getType()=="redbull")
            {
                 this.chaseCam.position.set(0,100,-200);
            }
            else if(this.car.getType()=="mclaren")
            {
                 this.chaseCam.position.set(0,2,-6);
            }
            else if(this.car.getType()=="ferrari")
            {
                 this.chaseCam.position.set(0,4,-10);
            }
       }

       this.carMesh=this.car.getCarMesh();
    }

    moveCar()
    {

        if(this.controller.speed>this.controller.maxSpeed)
        {
            this.controller.speed=this.controller.maxSpeed;
        }
        //dont want to be able to reverese
        if(this.controller.speed<0)
        {
            this.controller.speed=0;
        }
        this.controller.updateDelta(this.delta);

        //update positon of car accoring to unit circle 
        this.car.updatePos(this.controller.speed*Math.sin(this.controller.angle),0,this.controller.speed*Math.cos(this.controller.angle),this.delta)

        //need to set quaternion of the car as radians not compatible type 
        //set axis angle on the y axis (rotate around y axis )
        this.car.updateAngle(0,1,0,this.controller.angle);

    }

    addPyramids()
    {
        const loader=new GLTFLoader();

        this.pyramid;
        loader.load("../assets/egypt/pyramid_1/scene.gltf",(gltf)=>{
            //cluster 1
            var mesh=gltf.scene;
            mesh.position.set(-1000,0,1500);
            mesh.scale.set(80,80,80);
            this.pyramid=mesh;
            this.scene.add(mesh);

            mesh.traverse(function(node){
                if(node.isMesh)
                {
                    node.castShadow=true;
                }
            });

            let copy0=SkeletonUtils.clone(this.pyramid);
            copy0.position.z=1200;
            copy0.position.x=2000
            copy0.rotateY(0.8);
            copy0.scale.set(80,80,80);
            this.scene.add(copy0);
            
            let copy1=SkeletonUtils.clone(this.pyramid);
            copy1.position.z=670;
            copy1.position.x=-1000
            copy1.rotateY(0.8);
            copy1.scale.set(40,40,40);
            this.scene.add(copy1);

            let copy2=SkeletonUtils.clone(this.pyramid);
            copy2.position.z=1500;
            copy2.position.x=50;
            copy2.rotateY(0.8);
            copy2.scale.set(60,60,60);
            this.scene.add(copy2);

            //cluster left side
            let copy3=SkeletonUtils.clone(this.pyramid);
            copy3.position.x=2500;
            copy3.position.z=0;
            copy3.rotateY(0.8);
            this.scene.add(copy3);

            let copy4=SkeletonUtils.clone(this.pyramid);
            copy4.position.x=2300;
            copy4.position.z=-1200;
            copy4.scale.set(30,30,30);
            this.scene.add(copy4);

            let copy5=SkeletonUtils.clone(this.pyramid);
            copy5.position.x=2300;
            copy5.position.z=-1800;
            copy5.rotateY(0.6);
            copy5.scale.set(30,30,30);
            this.scene.add(copy5);

            //cluster back/right

            let copy6=SkeletonUtils.clone(this.pyramid);
            copy6.position.x=-1700
            copy6.position.z=-1600;
            copy6.rotateY(0.6);
            copy6.scale.set(100,100,100);
            this.scene.add(copy6);



        });        

    }

    addSphynx()
    {
        const loader=new GLTFLoader();
        loader.load("../assets/egypt/sphynx/scene.gltf",(gltf)=>{
            var mesh=gltf.scene;
            mesh.position.set(50,-1,95);
            mesh.rotateY(Math.PI);
            mesh.scale.set(0.045,0.045,0.045);
            this.scene.add(mesh);
        });

        loader.load("../assets/egypt/sphynx/scene.gltf",(gltf)=>{
            var mesh=gltf.scene;
            mesh.position.set(-50,-1,95);
            mesh.rotateY(Math.PI);
            mesh.scale.set(0.045,0.045,0.045);
            this.scene.add(mesh);
        });
    }

    addPalace()
    {
        const loader=new GLTFLoader();
        loader.load("../assets/egypt/temple/scene.gltf",(gltf)=>{
            var mesh=gltf.scene;
            mesh.position.set(500,-1,0);
            //mesh.rotateY(Math.PI);
            mesh.scale.set(8,8,8);
            this.scene.add(mesh);
        });
    }

    addStatues()
    {
        const loader=new GLTFLoader();
        this.cat;
        loader.load("../assets/egypt/cat_statue/scene.gltf",(gltf)=>{
            var mesh=gltf.scene;
            mesh.position.set(300,1,350);
            mesh.scale.set(250,250,250);
            this.cat=mesh;
            this.scene.add(mesh);

            mesh.traverse(function(node){
                if(node.isMesh)
                {
                    node.castShadow=true;
                }
            });

            //front left
            let copy1=SkeletonUtils.clone(this.cat);
            copy1.position.x=1100;
            this.scene.add(copy1);

            //back right
            let copy2=SkeletonUtils.clone(this.cat);
            copy2.position.z=-1500
            copy2.rotateY(Math.PI);
            this.scene.add(copy2);
            //back left
            let copy3=SkeletonUtils.clone(this.cat);
            copy3.position.x=1100;
            copy3.position.z=-1500;
            copy3.rotateY(Math.PI);
            this.scene.add(copy3);
        });


    }

    addGrandStand()
    {
        let grandStand1=new Building(this.scene);
        grandStand1.grandStand(750,0,900,Math.PI);

        let grandStand2=new Building(this.scene);
        grandStand2.grandStand(750,0,-2050,0);
    }

    animate=()=>
    {
        //update cannonDebugger
        this.cannonDebugger.update();

        //cannon world updated every 1/60 seocnds
        this.cannonWorld.step(1/60);

        this.moveCar();

        if(this.control=="3")
        {
            this.updateChaseCam();
        }
        
        this.delta=this.clock.getDelta();
        const deltaAI=this.time.update().getDelta();
        //if(this.controller.getMoveMade()==true)
        //{
            //this.ferrariAI.updateAI(deltaAI);
       // }

       if(this.controller.getStartedTimer()==true)
       {
            console.log( "TIME: ",this.timer.getTime());
            if(this.timer.getTime()>=180)
            {
                document.querySelector(".in-game-menu-container-outer").style.display="none"
                document.getElementById("out-of-bounds-menu").style.display="flex";
                //stop game play
                this.sceneHandler.handlePause();
            }
       }

        this.ground.fuseGround();   
        this.normalBarrier.fuseNormalBarrier();
        this.renderer.render(this.scene,this.camera);
        if(this.sceneHandler.pause===false)
        {
            this.moveCar();
            requestAnimationFrame(this.animate);
        }
    }


    //window resize
    widnowResize=()=>
    {
        this.camera.aspect=window.innerWidth/window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth,window.innerHeight);
    }

    //set up orbit controlls
    initOrbitControls()
    {
        let Orbcontrols=new OrbitControls(this.camera,this.renderer.domElement);
    }

    initChaseCam()
    {
        this.chaseCam=new THREE.Object3D();
        //set chase cam psotion 1

        this.chaseCam.position.set(0,4,-10);
 
        this.chaseCamPivot=new THREE.Object3D();
        //offset distance 
        this.chaseCamPivot.position.set(0,0,0);
    
        //chasecam pivot is child of cahse cam object 
        //if pos chase cam changes, pivot changes 
        this.chaseCam.add(this.chaseCamPivot);
        this.scene.add(this.chaseCam);

    }

    updateChaseCam()
    {
        this.chaseCamPivot.getWorldPosition(this.view);
        if(this.view.y<1)
        {
            this.view.y=1;
        }

        this.camera.position.lerpVectors(this.camera.position, this.view,0.5);
    }

    restartScene(carChoice,controlType)
    {

        document.body.removeChild(this.renderer.domElement); 
        this.init(carChoice,controlType);
    }
}