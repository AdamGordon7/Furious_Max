import * as THREE from "../modules/three.module.js";
import * as CANNON from "../modules/cannon-es.js";
import * as YUKA from "../modules/yuka.module.js";
import CannonDebugger from "../modules/cannon-es-debugger.js";
import{OrbitControls}from"../modules/OrbitControls.js";
import{GLTFLoader} from "../modules/GLTFLoader.js";
import{ControlsInput} from "/js/controlls.js";
import{Track} from "/js/track.js";

class Phys{
    constructor()
    {
        this.setUpScene();
    }

    setUpScene()
    {
        //scene instance
        this.scene=new THREE.Scene();

        /*
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
        */
        
    

        //camera +camera settings
        this.camera=new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);
        this.camera.position.set(0,20,-30);
        this.camera.lookAt(new THREE.Vector3(0,0,0));

        //renderer +renderer settings
        this.renderer=new THREE.WebGLRenderer({antialias:true, alpha:true});
        this.renderer.setSize(window.innerWidth,window.innerHeight);
        this.renderer.outputEncoding=THREE.sRGBEncoding;
        this.renderer.setPixelRatio(window.devicePixelRatio);

        //add to body
        document.body.appendChild(this.renderer.domElement);
        //set window resizer
        window.addEventListener('resize',this.widnowResize);


        /* set up scene */
        this.initLights();
        this.initOrbitControls();
        //this.addTrack();
        
        //physics
        this.setUpCannon();
        this.ground();
        //this.box();
        //this.sphere();

        this.animate();
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

    ground()
    {
        //create three mesh to actually see
        const groundGeometry=new THREE.PlaneGeometry(30,30);
        const groundMaterial=new THREE.MeshBasicMaterial({
            color:0x000000,
            side:THREE.DoubleSide,
            wireframe:true
        });

        this.groundMesh=new THREE.Mesh(groundGeometry,groundMaterial);
        this.scene.add(this.groundMesh);


        //create physics material for grounid
        this.groundMaterialPhys=new CANNON.Material();

        //create physics Body
        //Infinite Plane
        //mass so reacts to gravity, STATIC as ground dosent move
        //add above material 
        this.groundBody=new CANNON.Body({
            shape: new CANNON.Box(new CANNON.Vec3(15,15,0.1)),
            mass:0,
            type:CANNON.Body.STATIC,
            material: this.groundMaterialPhys
        });
        //add new Body to phyics world
        this.cannonWorld.addBody(this.groundBody);

        //rotate ground
        this.groundBody.quaternion.setFromEuler(-Math.PI/2,0,0);

    }


    box()
    {
        //Three mesh
        const boxGeometry=new THREE.BoxGeometry(2,2,2);
        const boxMaterial=new THREE.MeshBasicMaterial({
            color:0x00ff00,
            wireframe:true
        });

        this.boxMesh=new THREE.Mesh(boxGeometry,boxMaterial);
        this.scene.add(this.boxMesh);

        // create phys material for box body 
        this.boxMaterialPhys=new CANNON.Material();


        //create physcs body for box 
        //box body must be half size of box mesh 
        //on spawn box and ground at same postion, leads to jump in beginning 
        //set postion to avouid thid
        this.boxBody=new CANNON.Body({
            shape:new CANNON.Box(new CANNON.Vec3(1,1,1)),
            mass:1,
            position: new CANNON.Vec3(1,20,0),
            material:this.boxMaterialPhys
        });
        this.cannonWorld.addBody(this.boxBody);

        //rotate body 
        //choose acis around whoch rotatooj happens
        //speed of rot=vel
        this.boxBody.angularVelocity.set(0,10,0);

        //slow down rot pver time e(0,1)
        this.boxBody.angularDamping=0.3;

        this.createBoxGroundContactMaterial();

    }

    createBoxGroundContactMaterial()
    {
        //create insnace of contact material
        //add the materials
        //{} set properties of material
        const boxGroundContactMaterial=new CANNON.ContactMaterial(
            this.groundMaterialPhys,
            this.boxMaterialPhys,
            {
                friction:0
            }
        );

        this.cannonWorld.addContactMaterial(boxGroundContactMaterial);
    }

    sphere()
    {
        //Three mesh
        const sphereGeometry=new THREE.SphereGeometry(2);
        const sphereMaterial=new THREE.MeshBasicMaterial({
            color:0xff0000,
            wireframe:true
        });
        this.sphereMesh=new THREE.Mesh(sphereGeometry,sphereMaterial);
        this.scene.add(this.sphereMesh);

        //phys mat
        this.sphereMaterialPhys=new CANNON.Material();


        //add body
        this.sphereBody=new CANNON.Body({
            mass:1,
            shape:new CANNON.Sphere(2),
            position:new CANNON.Vec3(0,18,0),
            material:this.sphereMaterialPhys,
        });
        this.cannonWorld.addBody(this.sphereBody);

        //add air resistance to sphere so it stops rolling after time
        this.sphereBody.linearDamping=0.31

        this.createSphereGroundContactMaterial();
    }

    createSphereGroundContactMaterial()
    {
        const sphereGroundContactMaterial=new CANNON.ContactMaterial(
            this.groundMaterialPhys,
            this.sphereMaterialPhys,
            {
                restitution:0.9
            }
        );
         this.cannonWorld.addContactMaterial(sphereGroundContactMaterial);
    }

    movePhys()
    {
        //fuse mesh and body
        this.groundMesh.position.copy(this.groundBody.position);
        this.groundMesh.quaternion.copy(this.groundBody.quaternion);

        
        //fuse box
        this.boxMesh.position.copy(this.boxBody.position);
        this.boxMesh.quaternion.copy(this.boxBody.quaternion);

        //fuse sphere
        this.sphereMesh.position.copy(this.sphereBody.position);
        this.sphereMesh.quaternion.copy(this.sphereBody.quaternion);
        

    }


    //add lights to scene
    initLights()
    {
        //ambient lighting
        const AmbientLight=new THREE.AmbientLight();
        this.scene.add(AmbientLight);
    }

    //set up orbit controlls
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
        //update cannonDebugger
        this.cannonDebugger.update();

        //cannon world updated every 1/60 seocnds
        this.cannonWorld.step(1/60);

        //move physics and htree obj together
        this.movePhys();

        this.renderer.render(this.scene,this.camera);
        requestAnimationFrame(this.animate);
    }


    //window resize
    widnowResize=()=>
    {
        this.camera.aspect=window.innerWidth/window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth,window.innerHeight);
    }
    
}

let game=new Phys();