import * as THREE from "../modules/three.module.js";
import * as CANNON from "../modules/cannon-es.js";
import * as YUKA from "../modules/yuka.module.js";
import CannonDebugger from "../modules/cannon-es-debugger.js";
import{OrbitControls}from"../modules/OrbitControls.js";
import{GLTFLoader} from "../modules/GLTFLoader.js";
import{ControlsInput} from "/js/controlls.js";

export class Car
{

    constructor(scene,cannonWorld,camera,chaseCam, control,car,sceneHandler, track,loadingManager)
    {
        //scene vairbales 
        this.scene=scene;
        this.sceneHandler=sceneHandler;
        this.cannonWorld=cannonWorld;
        this.camera=camera;
        this.chaseCam=chaseCam;
        this.loadingManager=loadingManager;

        //car related varibales
        this.control=control;
        this.carType;
        this.track=track;

        //lap variables
        this.lap=1;
        this.clock=new THREE.Clock();
        this.prevLapTime=0; //holds prev laptime
        this.lap1=0;  //lap 1 time
        this.lap2=0; //lap 2 time
        this.lap3=0; //lap 3 time

        //out of bounds varibales
        this.outOfBounds=false; //weather or not we are out of bounds
        this.startedOutOfBoundsClock=false; //have we started the clock to check how long out 
        this.outOfBoundsTimer; //time out of bounds

        //call relevant fucntion to create the car
        if(car=="ferrari")
        {
            this.ferarri();
            this.carType="ferrari";
        }
        else if(car=="redbull")
        {
            this.redbull();
            this.carType="redbull";
        }
        else
        {
            this.mclaren();
            this.carType="mclaren";
        }
    }

    //creates ferrari
    ferarri()
    {
        
        //PHYSICS body of the car
        this.ferrariMaterialPhys=new CANNON.Material();
        this.ferrariBody=new CANNON.Body({
            mass:100,
            Material:this.ferrariMaterialPhys,
            shape:new CANNON.Box(new CANNON.Vec3(1.75,1.15,5)),
            position:new CANNON.Vec3(1,1,0)
        });
        this.cannonWorld.addBody(this.ferrariBody); //add car body to physics world

        //load car model
        //THREE component of the car 
        const gltfLoader=new GLTFLoader(this.loadingManager);
        this.ferrariMesh;
        gltfLoader.load("../assets/Cars/ferrari_f175/scene.gltf",(gltf)=>{
            const carMesh=gltf.scene;
            carMesh.position.x=this.ferrariBody.position.x;
            carMesh.position.y=this.ferrariBody.position.y-1;
            carMesh.position.z=this.ferrariBody.position.z;
            carMesh.quaternion.copy(this.ferrariBody.quaternion);
            this.ferrariMesh=carMesh;
            //third person controlls setup
            if(this.control=="3")
            {
                this.ferrariMesh.add(this.chaseCam);
            }
            //first person control setup
            else if(this.control=="1")
            {
                this.camera.position.set(0,1.6,0);
                this.camera.rotateY(Math.PI);
                this.ferrariMesh.add(this.camera);
            }
            this.scene.add(carMesh); //add car to passed in scene
        });
    }

    //creates redbull
    redbull()
    {
        this.redbullMaterialPhys=new CANNON.Material();
        this.redbullBody=new CANNON.Body({
            mass:1000,
            Material:this.redbullMaterialPhys,
            shape:new CANNON.Box(new CANNON.Vec3(1.75,1.15,5)),
            position:new CANNON.Vec3(1,1,0)
        });
        this.cannonWorld.addBody(this.redbullBody);

        const gltfLoader=new GLTFLoader(this.loadingManager);
        this.redbullMesh;
        gltfLoader.load("../assets/Cars/redbull/scene.gltf",(gltf)=>{
            const carMesh=gltf.scene;
            carMesh.position.x=this.redbullBody.position.x;
            carMesh.position.y=this.redbullBody.position.y-1;
            carMesh.position.z=this.redbullBody.position.z;
            carMesh.quaternion.copy(this.redbullBody.quaternion);
            carMesh.scale.set(0.04,0.04,0.04)
            this.redbullMesh=carMesh;
            if(this.control=="3")
            {
                this.redbullMesh.add(this.chaseCam);
            }
            else if(this.control=="1")
            {
                 this.camera.position.set(0,40,0);
                 this.camera.rotateY(Math.PI);
                 this.redbullMesh.add(this.camera);
            }
            this.scene.add(carMesh);
        });
    }

    //creates mclaren
    mclaren()
    {
        this.mclarenMaterialPhys=new CANNON.Material();
        this.mclarenBody=new CANNON.Body({
            mass:1000,
            Material:this.mclarenMaterialPhys,
            shape:new CANNON.Box(new CANNON.Vec3(1.75,1.15,5.7)),
            position:new CANNON.Vec3(1,1.1,0)
        });

        this.cannonWorld.addBody(this.mclarenBody);

        const gltfLoader=new GLTFLoader(this.loadingManager);
        this.mclarenMesh;
        gltfLoader.load("../assets/Cars/mclaren_mcl35/scene.gltf",(gltf)=>{
            const carMesh=gltf.scene;
            this.mclarenMesh=carMesh;
            carMesh.position.x=this.mclarenBody.position.x;
            carMesh.position.y=this.mclarenBody.position.y;
            carMesh.position.z=this.mclarenBody.position.z+0.7;
            carMesh.quaternion.copy(this.mclarenBody.quaternion);
            carMesh.scale.set(2,2,2);
            if(this.control=="3")
            {
                this.mclarenMesh.add(this.chaseCam);
            }
            else if(this.control=="1")
            {
                this.camera.position.set(0,0.2,-0.3);
                this.camera.rotateY(Math.PI);
                this.mclarenMesh.add(this.camera);
            }
            this.scene.add(carMesh);
        });
    }

    //function to check if car is out of bounds in desert track
    boundsCheckDesert(pos)
    {
        //start straight
        if(pos.x<35 && pos.x>-35 && pos.z<735 && pos.z>-1890)
        {
            this.startedOutOfBoundsClock=false; //if we come back in bounds stop the timer
            this.outOfBounds=false; //set back to false
        }
        
        //front straight
        else if(pos.x>-14 && pos.x<1455 && pos.z>690 && pos.z<768)
        {
            this.startedOutOfBoundsClock=false;
            this.outOfBounds=false;
        }
        
        //back straigt 
        else if(pos.x<1467 && pos.x>1380 && pos.z<735 && pos.z>-1890)
        {
            this.startedOutOfBoundsClock=false;
            this.outOfBounds=false;
        }
        
        //penultimate straight 
        else if(pos.x<1455 && pos.x>-14 && pos.z<-1845 && pos.z>-1930)
        {
            this.startedOutOfBoundsClock=false;
            this.outOfBounds=false;
        }
        else
        {
            //out of bounds
            this.outOfBounds=true;
        }
    }

    //tidy up pen 
    //bounds checking for forrest track
    boundsCheckForest(pos)
    {
        //main straight
        if(pos.x<42 && pos.x>-35 && pos.z<411 && pos.z>-437)
        {
            this.startedOutOfBoundsClock=false;
            this.outOfBounds=false;
        }
        //chicane 1->turn one
        else if(pos.x<236 && pos.x>40 && pos.z<470 && pos.z>370)
        {
            this.startedOutOfBoundsClock=false;
            this.outOfBounds=false;
        }
        //chicane 1->turn 2
        else if(pos.x<290 && pos.x>190 && pos.z<980 && pos.z>466)
        {
            this.startedOutOfBoundsClock=false;
            this.outOfBounds=false;
        }
        //front straiht
        else if(pos.x<1020 && pos.x>284 && pos.z<1045 && pos.z>967)
        {
            this.startedOutOfBoundsClock=false;
            this.outOfBounds=false;
        }
        //back str
        else if(pos.x<1090 && pos.x>1028 && pos.z<968 && pos.z>74)
        {
            this.startedOutOfBoundsClock=false;
            this.outOfBounds=false;
        }
        //str 3
        else if(pos.x<1569 && pos.x>1058 && pos.z<64 && pos.z>-14)
        {
            this.startedOutOfBoundsClock=false;
            this.outOfBounds=false;
        }
        //str4
        else if(pos.x<1596&& pos.x>1523 && pos.z<-14 && pos.z>-504)
        {
            this.startedOutOfBoundsClock=false;
            this.outOfBounds=false;
        }
        //two penultimate checks as track moves 
        //pen1
        else if(pos.x<1528 && pos.x>19 && pos.z<-459 && pos.z>-540)
        {
            this.startedOutOfBoundsClock=false;
            this.outOfBounds=false;
        }
        //pen1
        else if(pos.x<1528 && pos.x>19 && pos.z<-400 && pos.z>-485)
        {
            this.startedOutOfBoundsClock=false;
            this.outOfBounds=false;
        }
        else
        {
            this.outOfBounds=true;
        }
    }

    //bounds checking for Marina track
    boundsCheckMarina(pos)
    {
        //main straight-1
        if(pos.x<33 && pos.x>-53 && pos.z<430 && pos.z>-1595)
        {
            this.startedOutOfBoundsClock=false;
            this.outOfBounds=false;
        }

        else if(pos.x<515 && pos.x>16 && pos.z<463 && pos.z>384)
        {
            this.startedOutOfBoundsClock=false;
            this.outOfBounds=false;
        }

        //clean up a bit
        else if(pos.x<560 && pos.x>490 && pos.z<1225 && pos.z>405)
        {
            this.startedOutOfBoundsClock=false;
            this.outOfBounds=false;
        }

        //front str
        else if(pos.x<1059 && pos.x>543 && pos.z<1281 && pos.z>1207)
        {
            this.startedOutOfBoundsClock=false;
            this.outOfBounds=false;
        }

        //back str->tidy left x
        else if(pos.x<1066 && pos.x>1000 && pos.z<1288 && pos.z>-770)
        {
            this.startedOutOfBoundsClock=false;
            this.outOfBounds=false;
        }

        else if(pos.x<1029 && pos.x>790 && pos.z<-716 && pos.z>-832)
        {
            this.startedOutOfBoundsClock=false;
            this.outOfBounds=false;
        }

        else if(pos.x<827 && pos.x>765 && pos.z<-784 && pos.z>-1592)
        {
            this.startedOutOfBoundsClock=false;
            this.outOfBounds=false;
        }

        else if(pos.x<806 && pos.x>-30 && pos.z<-1558 && pos.z>-1632)
        {
            this.startedOutOfBoundsClock=false;
            this.outOfBounds=false;
        }


        else
        {
            this.outOfBounds=true;
        }

    }


    //updates the lap counter as well as checks the bounds 
    updateLap(pos)
    {
        /* bounds checking */

        //if marina track, on each loop call the bounds check for the marina track
        if(this.track==1)
        {

            this.boundsCheckMarina(pos);

        }
        //if desert track, on each loop call the bounds check for the desert track
        else if(this.track==2)
        {

            this.boundsCheckDesert(pos);
        }
        //if forest track, on each loop call the bounds check for the forest track
        else
        {
            this.boundsCheckForest(pos);
        }
        // check if out of bounds is true
        if(this.outOfBounds==true)
        {
            //if we havent already set started count to true, do it now 
            if(!this.startedOutOfBoundsClock)
            {
                //get time we went out of bounds 
                this.outOfBoundsTimer=this.clock.getElapsedTime();
                this.startedOutOfBoundsClock=true;
            }
            //check if the time we went out is less than 5 sec from curr time
            if(this.clock.getElapsedTime()-this.outOfBoundsTimer>5)
            {
                //display out of bounds menu
                document.querySelector(".in-game-menu-container-outer").style.display="none"
                document.getElementById("out-of-bounds-menu").style.display="flex";
                //stop game play
                this.sceneHandler.handlePause();
            }
            
        }

        /* lap timer and Counter */
        var currentLap=this.clock.getElapsedTime();
        //if diff between last time we crossed finish and this curetn amount of total time elapsed>10 sec  update 
        if(pos.z>36 && pos.z<42 && pos.x>-30 && pos.x<35 && currentLap-this.prevLapTime>10)
        {
            this.prevLapTime=this.clock.getElapsedTime();
            //save lap time in relevant vairble 
            if(this.lap===1)
            {
                this.lap1=this.prevLapTime;
            }
            else if(this.lap===2)
            {
                this.lap2=this.prevLapTime-this.lap1;
            }
            else
            {
                this.lap3=this.prevLapTime-this.lap2-this.lap1;
            }
            //if we finished the three laps
            if(this.lap>=3)
            {
                //stop game 
                this.sceneHandler.handlePause(); 
                //get score board elements 
                let lap1Elem=document.getElementById("position-1-lap-1-time");
                let lap2Elem=document.getElementById("position-1-lap-2-time");
                let lap3Elem=document.getElementById("position-1-lap-3-time");
                let totalElem=document.getElementById("position-1-total-lap-time");

                //set to relevent lap time
                lap1Elem.textContent=Math.round(this.lap1 * 100) / 100;
                lap2Elem.textContent=Math.round(this.lap2 * 100) / 100;
                lap3Elem.textContent=Math.round(this.lap3 * 100) / 100;
                totalElem.textContent=Math.round(this.prevLapTime * 100) / 100;

                //show leaderboard
                document.querySelector(".in-game-menu-container-outer").style.display="none"
                document.getElementById("out-of-bounds-menu").style.display="none";
                document.querySelector(".leaderBoard").style.display="flex";
            }

            this.lap+=1;


            //show lap count on screen
            var lapCountHTML=document.getElementById("lap-count");
            lapCountHTML.textContent="LAP: " + this.lap + "/3"
        }
    }

    //update the postion of the car based on control input
    //called in animate function in scene
    updatePos(x,y,z,delta)
    {
        //need a seperate check for each car type as there positions and scales
        //are different and therefore need to be updated differently 

        //ferrari 
        if(this.carType=="ferrari")
        {
            var currX=this.ferrariBody.position.x;
            var currY=this.ferrariBody.position.y;
            var currZ=this.ferrariBody.position.z;

            //set the postion of the physics body related to the ferrari to the new position
            this.ferrariBody.position.set(currX+x,currY+y,currZ+z);
            //check if mesh(model) has loaded yet
            if(this.ferrariMesh)
            {
                //set the position of the model to the position of the physics body 
                this.ferrariMesh.position.copy(this.ferrariBody.position);
                this.ferrariMesh.position.y-=1;
                if(this.control=="3")
                {
                    //if third person camera, we need to set the camera to look at new position
                    this.camera.lookAt(this.ferrariMesh.position);
                }
                //update lap and bounds on each position change
                this.updateLap(this.ferrariBody.position);
            }
        }
        //update for redbull
        else if(this.carType=="redbull")
        {
            var currX=this.redbullBody.position.x;
            var currY=this.redbullBody.position.y;
            var currZ=this.redbullBody.position.z;

            this.redbullBody.position.set(currX+x,currY+y,currZ+z);
            if(this.redbullMesh)
            {
                this.redbullMesh.position.copy(this.redbullBody.position);
                this.redbullMesh.position.y-=1;
                
                if(this.control=="3")
                {
                    this.camera.lookAt(this.redbullMesh.position);
                }
                this.updateLap(this.redbullBody.position);
            }
        }
        //updsate for mclaren
        else if(this.carType=="mclaren")
        {
            var currX=this.mclarenBody.position.x;
            var currY=this.mclarenBody.position.y;
            var currZ=this.mclarenBody.position.z;

            this.mclarenBody.position.set(currX+x,currY+y,currZ+z);
            if(this.mclarenMesh)
            {
                this.mclarenMesh.position.copy(this.mclarenBody.position);
                this.mclarenMesh.position.z+=0.7;
                if(this.control=="3")
                {
                    this.camera.lookAt(this.mclarenMesh.position);
                }
                this.updateLap(this.mclarenBody.position);
            }

        }
    
    }

    //above we updated coordinate, we also need to update the angle of the car
    updateAngle(x,y,z,angle)
    {

        if(this.carType=="ferrari")
        {
            //rotatate around the x,y,z coord by angle 
            this.ferrariBody.quaternion.setFromAxisAngle(new CANNON.Vec3(x,y,z),angle);
            if(this.ferrariMesh)
            {
                //model position must be the same as physics position
                this.ferrariMesh.quaternion.copy(this.ferrariBody.quaternion);
            }
        }
        else if(this.carType=="redbull")
        {

            this.redbullBody.quaternion.setFromAxisAngle(new CANNON.Vec3(x,y,z),angle);
            if(this.redbullMesh)
            {
                this.redbullMesh.quaternion.copy(this.redbullBody.quaternion);
            }
        }
        else if(this.carType=="mclaren")
        {
            this.mclarenBody.quaternion.setFromAxisAngle(new CANNON.Vec3(x,y,z),angle);
            if(this.mclarenMesh)
            {
                this.mclarenMesh.quaternion.copy(this.mclarenBody.quaternion);
            }
        }

    }

    //return the car type
    getType()
    {
        return this.carType;
    }

    //return the PHYSICS material of the car 
    getMaterialPhys()
    {
        if(this.carType=="ferrari")
        {
            return this.ferrariMaterialPhys;
        }
        if(this.carType=="redbull")
        {
            return this.redbullMaterialPhys;
        }
        if(this.carType=="mclaren")
        {
            return this.mclarenMaterialPhys;
        }
    }

    //return the THREE mesh of the car 
    getCarMesh()
    {
        if(this.carType=="ferrari")
        {
            return this.ferrariMesh;
        }
        if(this.carType=="redbull")
        {
            return this.redbullMesh;
        }
        if(this.carType=="mclaren")
        {
            return this.mclarenMesh;
        }
    }
};