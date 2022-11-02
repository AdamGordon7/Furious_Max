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
import { Building } from "./buildings.js";
import { SceneHandler } from "./scene.js";
import { Timer } from "./timer.js";


//scene used when forest track selected
export class SceneForrest{
    constructor(carChoice,controlType)
    {
        this.init(carChoice,controlType);
    }

    init(carChoice, controlType)
    {
        //set up scene
        this.timer= new Timer();
        this.sceneHandler=new SceneHandler();
        this.carChoice=carChoice;
        this.setUpScene();
        this.setUpCannon();

        this.controlType(controlType)
        this.initLights();
        this.createAssets()

        //add event listner for puase button
        //used when paused and button clicked to unpasue->starts animtion again
        const pauseButton = document.getElementById("pause-button");
        pauseButton.addEventListener("click", ()=>{
                this.animate();
            });
        
        //event listner for restart button    
        const restartBtn=document.getElementById("restart-button");
        restartBtn.addEventListener("click", ()=>{
            this.restartScene(carChoice,controlType);
        });

        //event listener for out of bouds menu restrt button
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
        //add all the elements to the scene
        //animate scene
        this.addHouses();
        this.addCastles();
        this.addGrandStand();
        this.addCar();
        this.addTrack();
        this.addGround();
        this.animate();

    }

    setUpScene()
    {
        this.scene=new THREE.Scene();

        //skybox
        this.scene.background=new THREE.CubeTextureLoader()
        .setPath("../assets/skybox/skybox/grass_mountain/")
        .load([
            "lt.jpg", //pos x 
            "rt.jpg", //neg x 
            "up.jpg", //pos y 
            "dn.jpg", //neg y
            "ft.jpg", //pos z
            "bk.jpg" //neg z
        ]);
       
        //the redbull car needs different far clipping plane to the other 2 cars
        if(this.carChoice!="redbull")
        {
            this.camera=new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.01,10000);
        }
        else
        {
            this.camera=new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.01,100000);
        }
        this.camera.position.set(0,4,-10);

        //renderer + renderer settings
        this.renderer=new THREE.WebGLRenderer({antialias:true, alpha:true,setDepthTest:true});
        this.renderer.setSize(window.innerWidth,window.innerHeight);
        this.renderer.outputEncoding=THREE.sRGBEncoding;
        this.renderer.setPixelRatio(window.devicePixelRatio);
        //enable shadow mapping
        this.renderer.shadowMap.enabled=true;
        this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;
        document.body.appendChild(this.renderer.domElement);

        //set window resizer
        window.addEventListener('resize',this.widnowResize);

        //initiaise clock variable
        this.clock=new THREE.Clock();
        this.delta=this.clock.getDelta();
        this.controller=new ControlsInput(this.delta, this.timer, this.sceneHandler);

        //used for chase camera 
        this.view=new THREE.Vector3();

        //variable holding control type (1st vs 3rd)
        this.control;
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

    //set control types
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

    //set up orbit controlls
    initOrbitControls()
    {
        let Orbcontrols=new OrbitControls(this.camera,this.renderer.domElement);
    }

    //add lights to scene
    initLights()
    {
        //ambient lighting
        const AmbientLight=new THREE.AmbientLight();
        this.scene.add(AmbientLight);
        

        //const light=new THREE.DirectionalLight();
        //light.position.set(25,120,25);

        //spot light for shadows
        const spotLight = new THREE.SpotLight( 0xffffff );
        spotLight.position.set( 3500, 1000, -2000 );

        spotLight.castShadow = true;

        spotLight.shadow.mapSize.width = 1024*6;
        spotLight.shadow.mapSize.height = 1024*6;

        spotLight.shadow.camera.near = 10;
        spotLight.shadow.camera.far = 3000;
        spotLight.shadow.camera.fov = 70;

        this.scene.add( spotLight );
    
    }

    //set up car
    addCar()
    {
        this.car;
        //instanciate a car model from the Car Class
        this.car=new Car(this.scene, this.cannonWorld,this.camera,this.chaseCam,this.control,this.carChoice,this.sceneHandler,3);

        //set chase camera position depending on each car
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
            else
            {
                 this.chaseCam.position.set(0,4,-10);
            }
       }

       //get refrence to the carmesh of the model
       this.carMesh=this.car.getCarMesh();
    }

    //update car position based on input and controller
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

        //using the above defined refrnece to the carmesh
        //update its position by calling the function in the car class
        //update positon of car accoring to unit circle 
        this.car.updatePos(this.controller.speed*Math.sin(this.controller.angle),0,this.controller.speed*Math.cos(this.controller.angle),this.delta)

        //need to set quaternion of the car as radians not compatible type 
        //set axis angle on the y axis (rotate around y axis )
        this.car.updateAngle(0,1,0,this.controller.angle);

    }

    //add the ground to the scene
    addGround()
    {
        //instanciate a ground->physics
        this.ground=new Ground(this.scene,this.cannonWorld,"ground");
        //create a grass textured ground
        this.ground.createGrass(800,-0.2,100, 10000,10000);
    }

    //add the track by instanciating the track class.
    addTrack()
    {
        let track=new Track(this.scene,this.cannonWorld,1);
    }

    addHouses()
    {
        const loader=new GLTFLoader();
        
        this.hut;
        loader.load("./assets/transylvania/houses/house_1/scene.gltf",(gltf)=>{
            var mesh=gltf.scene;
            mesh.position.set(2000,-1030,-1200)
            mesh.scale.set(20,20,20)
            this.hut=mesh;
            this.scene.add(mesh);

            mesh.traverse(function(node){
                if(node.isMesh)
                {
                    node.castShadow=true;
                }
            });

            let copy1=SkeletonUtils.clone(this.hut);
            copy1.position.z=-800;
            copy1.position.x=1850;
            copy1.rotateY(Math.PI/2)
            this.scene.add(copy1);

            let copy2=SkeletonUtils.clone(this.hut);
            copy2.position.z=-1200;
            copy2.position.x=1700;
            copy2.rotateY(Math.PI/2)
            this.scene.add(copy2);

            let copy3=SkeletonUtils.clone(this.hut);
            copy3.position.z=-850;
            copy3.position.x=2000;
            this.scene.add(copy3);

            let copy4=SkeletonUtils.clone(this.hut);
            copy4.position.z=-850;
            copy4.position.x=2300;
            this.scene.add(copy4);


        });

        loader.load("./assets/transylvania/houses/house_3/scene.gltf",(gltf)=>{
            var mesh=gltf.scene;
            mesh.position.set(2500,10,-1000)
            mesh.rotateY(-0.3+Math.PI/-4);
            mesh.scale.set(60,60,60)
            this.scene.add(mesh);

            mesh.traverse(function(node){
                if(node.isMesh)
                {
                    node.castShadow=true;
                }
            });
        });

        this.house=new Building(this.scene);
        this.house.house1(2000,100,-800,Math.PI/6);
        this.house.house2(1800,100,-1000,Math.PI/4);

        this.house2=new Building(this.scene);
        this.house.house1(2000,100,-400,Math.PI/6);
        this.house.house2(1600,100,-1200,Math.PI/4);

    }

    addCastles()
    {
        const loader=new GLTFLoader();

        //castle on mountain-good speed
        loader.load("./assets/transylvania/castles/castle_5/scene.gltf",(gltf)=>{
            var mesh=gltf.scene;
            mesh.position.set(1800,270,1700);
            //mesh.rotateY(Math.PI+0.3)
            mesh.scale.set(50,50,50);
            this.scene.add(mesh);
        });

        //dracula castle-quick load
        loader.load("./assets/transylvania/castles/castle_2/scene.gltf",(gltf)=>{
            var mesh=gltf.scene;
            mesh.position.set(400,-2000,-1800);
            mesh.rotateY(Math.PI);
            mesh.scale.set(1200,1200,1200);
            this.scene.add(mesh);
        });

        //castle with land, good speeds
        loader.load("./assets/transylvania/castles/castle_4/scene.gltf",(gltf)=>{
            var mesh=gltf.scene;
            mesh.position.set(-1700,350,1300);
            mesh.scale.set(22,22,22);
            this.scene.add(mesh);
        });
        
    }

    addGrandStand()
    {
        let grandStand=new Building(this.scene);
        grandStand.grandStandTrans(-100,0,0,Math.PI/2)
    }


    animate=()=>
    {
        //update cannonDebugger
        //this.cannonDebugger.update();

        //cannon world updated every 1/60 seocnds
        this.cannonWorld.step(1/60);

        if(this.control=="3")
        {
            this.updateChaseCam();
        }
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
        
        this.delta=this.clock.getDelta();

        this.ground.fuseGround();   

        this.renderer.render(this.scene,this.camera);

        //decouple animate adn render inot updte 
        if(this.sceneHandler.pause===false)
        {
            this.moveCar();
            requestAnimationFrame(this.animate);
        }
    }


    widnowResize=()=>
    {
        this.camera.aspect=window.innerWidth/window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth,window.innerHeight);
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