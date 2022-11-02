import * as THREE from "../modules/three.module.js";
import * as CANNON from "../modules/cannon-es.js";
import * as YUKA from "../modules/yuka.module.js";
import CannonDebugger from "../modules/cannon-es-debugger.js";
import{OrbitControls}from"../modules/OrbitControls.js";
import{GLTFLoader} from "../modules/GLTFLoader.js";
import{ControlsInput} from "/js/controlls.js";
import{Track} from "/js/track.js";
import{Car} from "/js/car.js";



export class Ground{

    /*
    constructor(scene,cannonWorld,resource, carMaterialPhys){

        this.scene=scene;
        this.cannonWorld=cannonWorld;
        this.carMaterialPhys=carMaterialPhys;

        if(resource=="ground")
        {
            this.createGroundPlane();
        }
        if(resource=="gravel")
        {
            this.createGravelTrap();
        }
        if(resource=="beach")
        {
            this.createBeach(0,1,0, 100,10);
        }

    }
    */

    constructor(scene,cannonWorld,resource){

        this.scene=scene;
        this.cannonWorld=cannonWorld;
       // this.carMaterialPhys=carMaterialPhys;

        if(resource=="ground")
        {
            this.createGroundPlane();
        }
        if(resource=="gravel")
        {
            this.createGravelTrap();
        }
        if(resource=="beach")
        {
            this.createBeach(0,1,0, 100,10);
        }

    }

    createGroundPlane()
    {
        //ThreeJs object so we can see it
        this.groundGeometry=new THREE.PlaneGeometry(30,30);
        this.groundMaterial=new THREE.MeshBasicMaterial({
            color:0x17135D,
            side:THREE.DoubleSide,
            wireframe:true
        });

        this.groundMesh=new THREE.Mesh(this.groundGeometry,this.groundMaterial);
        this.groundMesh.receiveShadow=true;
        this.scene.add(this.groundMesh);

        //create physics body: Material, Body 
        this.groundMaterialPhys=new CANNON.Material();
        this.groundBody=new CANNON.Body({
            shape: new CANNON.Plane(),
            material:this.groundMaterialPhys,
        });

        this.cannonWorld.addBody(this.groundBody);
        this.groundBody.quaternion.setFromEuler(-Math.PI/2,0,0);
    }

    //call in anim function to fuse in every frame 
    fuseGround()
    {
        this.groundMesh.position.copy(this.groundBody.position);
        this.groundMesh.quaternion.copy(this.groundBody.quaternion);
    }

    createGravelTrap()
    {
        //texture for THREE obj
        const textureLoader=new THREE.TextureLoader();
        const gravelTexture=textureLoader.load("../assets/groundTexture/gravelTrap.jpg");
        gravelTexture.wrapS=THREE.RepeatWrapping;
        gravelTexture.wrapT=THREE.RepeatWrapping;
        gravelTexture.repeat.set(10,10);


        //THREE
        const gravelGeometry=new THREE.PlaneGeometry(100,100);
        const gravelMaterial=new THREE.MeshStandardMaterial({
            side:THREE.DoubleSide,
            map: gravelTexture
        });
        this.gravelMesh=new THREE.Mesh(gravelGeometry,gravelMaterial);
        this.scene.add(this.gravelMesh);

        //Phys
        this.gravelMaterialPhys=new CANNON.Material();
        this.gravelBody=new CANNON.Body({
            material:this.gravelMaterialPhys,
            shape:new CANNON.Box(new CANNON.Vec3(50,50,0.1)),
           
        });
        this.cannonWorld.addBody(this.gravelBody);
        this.gravelBody.quaternion.setFromEuler(-Math.PI/2,0,0);
        this.gravelBody.position.set(90,0,0);

        //this.createCarGravelContactMaterial();
    }

    fuseGravelTrap()
    {
        this.gravelMesh.position.copy(this.gravelBody.position);
        this.gravelMesh.quaternion.copy(this.gravelBody.quaternion);
    }

    createCarGravelContactMaterial()
    {
        const carGravelContactMaterial=new CANNON.ContactMaterial(
            this.carMaterialPhys,
            this.gravelMaterialPhys,
            {
                restitution:0.9
            }
        );

        this.cannonWorld.addContactMaterial(carGravelContactMaterial);
    }

    createBeach(xPos,yPos,zPos,xSize,zSize)
    {
        //texture for THREE obj
        const textureLoader=new THREE.TextureLoader();
        const beachTexture=textureLoader.load("../assets/groundTexture/beach_1.jpg");
        beachTexture.wrapS=THREE.RepeatWrapping;
        beachTexture.wrapT=THREE.RepeatWrapping;
        beachTexture.repeat.set(10,10);


        //THREE
        const beachGeometry=new THREE.PlaneGeometry(xSize,zSize);
        const beachMaterial=new THREE.MeshStandardMaterial({
            side:THREE.DoubleSide,
            map: beachTexture
        });

        this.beachMesh=new THREE.Mesh(beachGeometry,beachMaterial);
        this.beachMesh.position.set(xPos,yPos,zPos);
        this.beachMesh.rotateX(Math.PI/2)
        this.beachMesh.receiveShadow=true;
        this.scene.add(this.beachMesh)
    }

    createAsphalt(xPos,yPos,zPos,xSize,zSize)
    {

        //texture for THREE obj
        const textureLoader=new THREE.TextureLoader();
        const asphaltTexture=textureLoader.load("../assets/groundTexture/asphalt_2.jpg");
        asphaltTexture.wrapS=THREE.RepeatWrapping;
        asphaltTexture.wrapT=THREE.RepeatWrapping;
        asphaltTexture.repeat.set(10,10);


        //THREE
        const asphaltGeometry=new THREE.PlaneGeometry(xSize,zSize);
        const asphaltMaterial=new THREE.MeshStandardMaterial({
            side:THREE.DoubleSide,
            map: asphaltTexture
        });

        this.asphaltMesh=new THREE.Mesh(asphaltGeometry,asphaltMaterial);
        this.asphaltMesh.position.set(xPos,yPos,zPos);
        this.asphaltMesh.rotateX(Math.PI/2)
        this.asphaltMesh.receiveShadow=true;
        this.scene.add(this.asphaltMesh)
            
    }

    createDesertGround(xPos,yPos,zPos,xSize,zSize)
    {

        //texture for THREE obj
        const textureLoader=new THREE.TextureLoader();
        const desertTexture=textureLoader.load("../assets/groundTexture/desert_1.jpg");
        desertTexture.wrapS=THREE.RepeatWrapping;
        desertTexture.wrapT=THREE.RepeatWrapping;
        desertTexture.repeat.set(60,60);


        //THREE
        const desertGeometry=new THREE.PlaneGeometry(xSize,zSize);
        const desertMaterial=new THREE.MeshStandardMaterial({
            side:THREE.DoubleSide,
            map: desertTexture
        });

        this.desertMesh=new THREE.Mesh(desertGeometry,desertMaterial);
        this.desertMesh.position.set(xPos,yPos,zPos);
        this.desertMesh.rotateX(Math.PI/2)
        this.desertMesh.receiveShadow=true;
        this.scene.add(this.desertMesh)
            
    }

    createGrass(xPos,yPos,zPos, xSize,zSize)
    {
        //texture for THREE obj
        const textureLoader=new THREE.TextureLoader();
        const grassTexture=textureLoader.load("../assets/groundTexture/grass_5.jpg");
        grassTexture.wrapS=THREE.RepeatWrapping;
        grassTexture.wrapT=THREE.RepeatWrapping;
        grassTexture.repeat.set(5,5);


        //THREE
        const grassGeometry=new THREE.PlaneGeometry(xSize,zSize);
        const grassMaterial=new THREE.MeshStandardMaterial({
            side:THREE.DoubleSide,
            map: grassTexture
        });

        this.grassMesh=new THREE.Mesh(grassGeometry,grassMaterial);
        this.grassMesh.position.set(xPos,yPos,zPos);
        this.grassMesh.rotateX(Math.PI/2)
        this.grassMesh.receiveShadow=true;
        this.scene.add(this.grassMesh)

    }







}