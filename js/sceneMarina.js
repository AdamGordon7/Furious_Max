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
import { Timer } from "./timer.js";

export class SceneMarina{
    constructor(carChoice,controlType)
    {
        this.init(carChoice,controlType);
    }

    init(carChoice, controlType)
    {
        this.timer= new Timer();
        this.sceneHandler=new SceneHandler();
        this.carChoice=carChoice;
        //set up loading screen scene
        this.loadingScreen={
            scene: new THREE.Scene(),
            camera: new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.01,10000),
            box: new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial({color:0x80e5ff}))
        }
        this.isResourceLoaded=false;
        this.loadingManager=null;
        this.setUpScene();
        this.setUpCannon();

        this.controlType(controlType)
        this.initLights();
        this.createAssets()

        const pauseButton = document.getElementById("pause-button");
        pauseButton.addEventListener("click", ()=>{
                this.animate();
                //alert("Game Paused! Click OK to unpause game"); 
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
        this.addYachts();
        this.createBuildings();
        this.addCar();
        this.addTrack();
        this.addWater();
        this.addGround();
        this.animate();

    }

    addWater()
    {
        const waterGeometry = new THREE.PlaneGeometry( 1820, 4000 );
       this.water = new Water(
            waterGeometry,
            {
                textureWidth: 512,
                textureHeight: 512,
                waterNormals: new THREE.TextureLoader().load( 'assets/textures/waternormals.jpg', ( texture )=> {

                    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

                } ),
                sunDirection: new THREE.Vector3(),
                sunColor: 0xffffff,
                waterColor: 0x001e0f,
                distortionScale: 3.7,
                fog: this.scene.fog !== undefined
            }
        );

        this.water.rotation.x = - Math.PI / 2;
        this.water.position.set(-950,-0.5,0);

        this.scene.add( this.water );
    }

    setUpScene()
    {
        //scene instance
        this.scene=new THREE.Scene();

        //add skybox
        
        this.scene.background=new THREE.CubeTextureLoader()
        .setPath("../assets/skybox/clouds1/")
        .load([
            "east.bmp", //pos x 
            "west.bmp", //neg x 
            "up.bmp", //pos y 
            "down.bmp", //neg y
            "north.bmp", //pos z
            "south.bmp" //neg z
        ]);
       
        //camera +camera settings
        if(this.carChoice!="redbull")
        {
            this.camera=new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.01,10000);
        }
        else
        {
            console.log("EXEC")
            this.camera=new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.01,100000);
        }
        this.camera.position.set(0,4,-10);

        //init loading scree
        this.loadingScreen.box.position.set(0,0,5);
        this.loadingScreen.camera.lookAt(this.loadingScreen.box.position);
        this.loadingScreen.scene.add(this.loadingScreen.box)
        this.loadingManager=new THREE.LoadingManager();
        this.loadingManager.onLoad=()=>{
            this.isResourceLoaded=true;
        }

        //renderer +renderer settings
        this.renderer=new THREE.WebGLRenderer({antialias:true, alpha:true,setDepthTest:true});
        this.renderer.setSize(window.innerWidth,window.innerHeight);
        this.renderer.outputEncoding=THREE.sRGBEncoding;
        this.renderer.setPixelRatio(window.devicePixelRatio);
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

        this.loader=new GLTFLoader(this.loadingManager);
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

        const spotLight = new THREE.SpotLight( 0xffffff );
        spotLight.position.set( 2500, 1000, 2800 );

        spotLight.castShadow = true;

        spotLight.shadow.mapSize.width = 1024*6;
        spotLight.shadow.mapSize.height = 1024*6;

        spotLight.shadow.camera.near = 10;
        spotLight.shadow.camera.far = 10000;
        spotLight.shadow.camera.fov = 70;

        this.scene.add( spotLight );
    }

    //set up orbit controlls
    initOrbitControls()
    {
        let Orbcontrols=new OrbitControls(this.camera,this.renderer.domElement);
    }

    addTrack()
    {
        let track=new Track(this.scene,this.cannonWorld,2,this.loadingManager);
    }

    
    addCar()
    {
        this.car;
        this.car=new Car(this.scene, this.cannonWorld,this.camera,this.chaseCam,this.control,this.carChoice,this.sceneHandler,1,this.loadingManager);

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

       this.carMesh=this.car.getCarMesh();
       
       
    }

    addGround()
    {
        this.ground=new Ground(this.scene,this.cannonWorld,"ground");
        this.gravelTrap=new Ground(this.scene,this.cannonWorld,"gravel");


        //beach front 
        this.beach1=new Ground(this.scene,this.cannonWorld,"");
        this.beach1.createBeach(230,-0.1,1220, 540,1520);

        //beach back
        this.beach2=new Ground(this.scene,this.cannonWorld,"",);
        this.beach2.createBeach(390,-0.1,-1830, 850,380);

        //asphalt1-main
        this.asphalt1=new Ground(this.scene,this.cannonWorld,"");
        this.asphalt1.createAsphalt(950,-1,0, 2000,5000);



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

    addYachts()
    {
        
        //yacht 1
        this.yacht1;
        this.loader.load('./assets/yacht/yacht_1/scene.gltf',(gltf)=>{
            var mesh=gltf.scene;
            this.yacht1=gltf.scene;
            mesh.position.y=120;
            mesh.position.x=-200;
            mesh.position.z=120
            mesh.scale.set(10,10,10);
            this.scene.add(mesh);

            let copy1=SkeletonUtils.clone(this.yacht1);
            copy1.position.set(-200,105,-450);
            copy1.rotateY(Math.PI/2+0.8);
            copy1.scale.set(10,10,10)
            this.scene.add(copy1);

            let copy2=SkeletonUtils.clone(this.yacht1);
            copy2.position.set(-200,150,-1200);
            copy2.rotateY(0.2);
            copy2.scale.set(13,13,13)
            this.scene.add(copy2);
    
            });

            //yacht 2
        this.yacht2;    
        this.loader.load('./assets/yacht/yacht_3/scene.gltf',(gltf)=>{
            var mesh=gltf.scene;
            this.yacht2=gltf.scene;
            mesh.position.y=300;
            mesh.position.x=-550;
            mesh.position.z=-250;
            mesh.rotateY(-0.5);
            mesh.scale.set(40,40,40);

            this.scene.add(mesh);

            let copy1=SkeletonUtils.clone(this.yacht2);
            copy1.position.set(-180,160,780);
            copy1.rotateY(0.5);
            copy1.scale.set(20,20,20)
            this.scene.add(copy1);
    
            });

            //yacht 3
        this.yacht3;
        this.loader.load('./assets/yacht/yacht_2/scene.gltf',(gltf)=>{
            var mesh=gltf.scene;
            mesh.position.y=-80;
            mesh.position.x=-190;
            mesh.position.z=900;
            mesh.rotateY(-Math.PI/2);
            mesh.scale.set(20,20,20);
            this.yacht3=mesh;
            this.scene.add(mesh);


            let copy1=SkeletonUtils.clone(this.yacht3);
            copy1.position.set(-140,-40,-200);
            copy1.scale.set(10,10,10)
            this.scene.add(copy1);
            });
            
    }

    createBuildings()
    {
        let grandStand1=new Building(this.scene, this.loadingManager);
        grandStand1.grandStand(900,0,1400,Math.PI);

        let building7=new Building(this.scene,this.loadingManager);
        building7.coolBuilding(1400,0,600);

        let building6=new Building(this.scene,this.loadingManager);
        building6.spiralBuilding(1400,0,100);

        let grandStand2=new Building(this.scene,this.loadingManager);
        grandStand2.grandStand(390,-0.1,-1830,0);

        let grandStand3=new Building(this.scene,this.loadingManager);
        grandStand3.grandStand(1000,-0.1,-1200,-Math.PI/2);

        let building1=new Building(this.scene,this.loadingManager);
        building1.skyScraper1(1800,400,0);

        let building2=new Building(this.scene,this.loadingManager);
        building2.skyScraper2(1800,400,-500);

        let building3=new Building(this.scene,this.loadingManager);
        building3.skyScraper3(1700,400,-1000);

        let building4=new Building(this.scene,this.loadingManager);
        building4.skyScraper4(1700,400,-1500);

        let building5=new Building(this.scene,this.loadingManager);
        building5.skyScraper5(1600,0,-600);

        let building8=new Building(this.scene,this.loadingManager);
        building8.skyScraper6(1200,200,1800);

        let building10=new Building(this.scene,this.loadingManager);
        building10.skyScraper4(1700,400,1000);

        let building9=new Building(this.scene,this.loadingManager);
        building9.skyScraper5(900,-0.1,1800);

    }
    

    animate=()=>
    {

        //if not resocures is loaded
        //render the loading screen and exit animation
        if(this.isResourceLoaded==false)
        {
            requestAnimationFrame(this.animate);
            this.renderer.render(this.loadingScreen.scene, this.loadingScreen.camera);
            return;
        }

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

        this.gravelTrap.fuseGravelTrap()


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
        this.timer=new Timer();
        this.timer.startTimer();
    }

    
}
