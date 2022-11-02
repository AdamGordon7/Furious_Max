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


export class Building
{
    constructor(scene, loadingManager)
    {
        this.scene=scene;
        this.loadingManager=loadingManager;
        this.loader=new GLTFLoader(this.loadingManager);
        this.textureLoader=new THREE.TextureLoader();
    }


    skyScraper1(x,y,z)
    {
        const building_1Texture=this.textureLoader.load("../assets/building_texture/building_1.jpg");
        building_1Texture.wrapS=THREE.RepeatWrapping;
        building_1Texture.wrapT=THREE.RepeatWrapping;
        building_1Texture.repeat.set(2,2);


        const building_1Geometry=new THREE.BoxGeometry(300,800,300);
        const building_1Material=new THREE.MeshPhongMaterial({
            side:THREE.DoubleSide,
            map:building_1Texture
        });

        this.building_1Mesh=new THREE.Mesh(building_1Geometry,building_1Material);
        this.building_1Mesh.position.set(x,y,z);
        this.scene.add(this.building_1Mesh);
    }

    skyScraper2(x,y,z)
    {

        const building_2Texture=this.textureLoader.load("../assets/building_texture/building_2.jpg");
        const building_2Geometry=new THREE.BoxGeometry(300,800,300);
        const building_2Material=new THREE.MeshPhongMaterial({
            side:THREE.DoubleSide,
            map:building_2Texture
        });

        this.building_2Mesh=new THREE.Mesh(building_2Geometry,building_2Material);
        this.building_2Mesh.position.set(x,y,z);
        this.scene.add(this.building_2Mesh);
    }

    skyScraper3(x,y,z)
    {
        const building_3Texture=this.textureLoader.load("../assets/building_texture/building_3.jpg");
        const building_3Geometry=new THREE.BoxGeometry(300,800,300);
        const building_3Material=new THREE.MeshPhongMaterial({
            side:THREE.DoubleSide,
            map:building_3Texture
        });

        this.building_3Mesh=new THREE.Mesh(building_3Geometry,building_3Material);
        this.building_3Mesh.position.set(x,y,z);
        this.scene.add(this.building_3Mesh);
    }

    skyScraper4(x,y,z)
    {
        const building_4Texture=this.textureLoader.load("../assets/building_texture/building_4.png");
        const building_4Geometry=new THREE.BoxGeometry(300,800,300);
        const building_4Material=new THREE.MeshPhongMaterial({
            side:THREE.DoubleSide,
            map:building_4Texture
        });

        this.building_4Mesh=new THREE.Mesh(building_4Geometry,building_4Material);
        this.building_4Mesh.position.set(x,y,z);
        this.scene.add(this.building_4Mesh);
    }

    skyScraper5(x,y,z)
    {
        const building_4Texture=this.textureLoader.load("../assets/building_texture/building_5.jpg");
        const building_4Geometry=new THREE.BoxGeometry(300,800,300);
        const building_4Material=new THREE.MeshPhongMaterial({
            side:THREE.DoubleSide,
            map:building_4Texture
        });

        this.building_4Mesh=new THREE.Mesh(building_4Geometry,building_4Material);
        this.building_4Mesh.position.set(x,y,z);
        this.scene.add(this.building_4Mesh);
    }


    spiralBuilding(x,y,z)
    {
        this.loader.load('./assets/building/spiral_building/scene.gltf',(gltf)=>{
            var mesh=gltf.scene;
            mesh.scale.set(0.7,0.7,0.7)
            mesh.position.set(x,y,z);
            this.scene.add(mesh);

            mesh.traverse(function(node){
                if(node.isMesh)
                {
                    node.castShadow=true;
                }
            });


            });
    }

    coolBuilding(x,y,z)
    {
        this.loader.load('./assets/building/building_1/scene.gltf',(gltf)=>{
            var mesh=gltf.scene;
            mesh.scale.set(0.65,0.65,0.65)
            mesh.position.set(x,y,z);

            mesh.traverse(function(node){
                if(node.isMesh)
                {
                    node.castShadow=true;
                }
            });
            
            this.scene.add(mesh);
            });

    }

    skyScraper6(x,y,z)
    {
        const building_4Texture=this.textureLoader.load("../assets/building_texture/building_6.jpg");
        const building_4Geometry=new THREE.BoxGeometry(200,600,200);
        const building_4Material=new THREE.MeshPhongMaterial({
            side:THREE.DoubleSide,
            map:building_4Texture
        });

        this.building_4Mesh=new THREE.Mesh(building_4Geometry,building_4Material);
        this.building_4Mesh.position.set(x,y,z);
        this.scene.add(this.building_4Mesh);
    }

    grandStand(x,y,z, angle)
    {
        this.loader.load('./assets/building/grandStand/grandStand2.glb',(gltf)=>{
            var mesh=gltf.scene;
            mesh.position.set(x,y,z);
            mesh.rotateY(angle);
            mesh.scale.set(10,10,10)
            this.scene.add(mesh);

            mesh.traverse(function(node){
                if(node.isMesh)
                {
                    node.castShadow=true;
                }
            });

            });
    }

    grandStandTrans(x,y,z, angle)
    {
        this.loader.load('./assets/building/grandStand/grandStand2.glb',(gltf)=>{
            var mesh=gltf.scene;
            mesh.position.set(x,y,z);
            mesh.rotateY(angle);
            mesh.scale.set(5,5,5)
            this.scene.add(mesh);

            mesh.traverse(function(node){
                if(node.isMesh)
                {
                    node.castShadow=true;
                }
            });
            
            });
    }

    house1(x,y,z,angle)
    {
        const house_1Texture=this.textureLoader.load("../assets/transylvania/textures/house_2.jpg");
        const house_1Geometry=new THREE.BoxGeometry(100,200,200);
        const house_1Material=new THREE.MeshStandardMaterial({
            side:THREE.DoubleSide,
            map:house_1Texture
        });

        this.house_1Mesh=new THREE.Mesh(house_1Geometry,house_1Material);
        this.house_1Mesh.position.set(x,y,z);
        this.house_1Mesh.rotateY(angle);
        this.house_1Mesh.castShadow=true;
    
        this.scene.add(this.house_1Mesh);


    }


    house2(x,y,z,angle)
    {
        const house_2Texture=this.textureLoader.load("../assets/transylvania/textures/house_1.jpg");
        const house_2Geometry=new THREE.BoxGeometry(100,200,200);
        const house_2Material=new THREE.MeshStandardMaterial({
            side:THREE.DoubleSide,
            map:house_2Texture
        });

        this.house_2Mesh=new THREE.Mesh(house_2Geometry,house_2Material);
        this.house_2Mesh.position.set(x,y,z);
        this.house_2Mesh.rotateY(angle);
        this.house_2Mesh.castShadow=true;
        this.scene.add(this.house_2Mesh);

    }
}