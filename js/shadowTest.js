import * as THREE from "../modules/three.module.js";
import * as CANNON from "../modules/cannon-es.js";
import * as YUKA from "../modules/yuka.module.js";
import CannonDebugger from "../modules/cannon-es-debugger.js";
import{OrbitControls}from"../modules/OrbitControls.js";
import{GLTFLoader} from "../modules/GLTFLoader.js";
import{ControlsInput} from "/js/controlls.js";
import{Track} from "/js/track.js";
import { PCFSoftShadowMap } from "../modules/three.module.js";

class Shadow{
    constructor()
    {
        this.setUpScene();
    }

    setUpScene()
    {
        //scene instance
        this.scene=new THREE.Scene();
        
        //camera +camera settings
        this.camera=new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);
        this.camera.position.set(0,20,-30);

        //renderer +renderer settings
        this.renderer=new THREE.WebGLRenderer({antialias:true, alpha:true});
        this.renderer.setSize(window.innerWidth,window.innerHeight);
        this.renderer.outputEncoding=THREE.sRGBEncoding;
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled=true;
        this.renderer.shadowMap.tyep=PCFSoftShadowMap;

        //add to body
        document.body.appendChild(this.renderer.domElement);
        //set window resizer
        window.addEventListener('resize',this.widnowResize);

        const loader = new THREE.CubeTextureLoader();
        const texture = loader.load([
            './resources/posx.jpg',
            './resources/negx.jpg',
            './resources/posy.jpg',
            './resources/negy.jpg',
            './resources/posz.jpg',
            './resources/negz.jpg',
        ]);
        this.scene.background = texture;
    


        /* set up scene */
        this.initLights();
        this.ground();
        this.initOrbitControls();
        this.shape();

        this.animate();
    }

    shape()
    {
        const box = new THREE.Mesh(
            new THREE.BoxGeometry(2, 2, 2),
            new THREE.MeshStandardMaterial({
                color: 0xFFFFFF,
            }));
          box.position.set(0, 1, 0);
          box.castShadow = true;
          box.receiveShadow = true;
          this.scene.add(box);
      
          for (let x = -8; x < 8; x++) {
            for (let y = -8; y < 8; y++) {
              const box = new THREE.Mesh(
                new THREE.BoxGeometry(2, 2, 2),
                new THREE.MeshStandardMaterial({
                    color: 0x808080,
                }));
              box.position.set(Math.random() + x * 5, Math.random() * 4.0 + 2.0, Math.random() + y * 5);
              box.castShadow = true;
              box.receiveShadow = true;
              this.scene.add(box);
            }
          }
    }


    ground()
    {
        const groundGeometry=new THREE.PlaneGeometry(3000,3000);
        const groundMaterial=new THREE.MeshStandardMaterial({
            color:0xFFFFFF,
            side:THREE.DoubleSide,
        });

        this.groundMesh=new THREE.Mesh(groundGeometry,groundMaterial);
        this.groundMesh.castShadow = false;
        this.groundMesh.receiveShadow = true;
        this.groundMesh.rotateX(Math.PI/2)
        this.scene.add(this.groundMesh);
    }

    //add lights to scene
    initLights()
    {
        let light=new THREE.DirectionalLight(0xFFFFFF,1.0);
        light.position.set(20,100,10);
        light.target.position.set(0,0,0);

        light.castShadow=true;

        light.shadow.bias = -0.001;
        light.shadow.mapSize.width = 2048;
        light.shadow.mapSize.height = 2048;
        light.shadow.camera.near = 0.1;
        light.shadow.camera.far = 500.0;
        light.shadow.camera.left = 100;
        light.shadow.camera.right = -100;
        light.shadow.camera.top = 100;
        light.shadow.camera.bottom = -100;
        this.scene.add(light);

        light = new THREE.AmbientLight(0x101010);
        this.scene.add(light);
    
    }

    //set up orbit controlls
    initOrbitControls()
    {
        let Orbcontrols=new OrbitControls(this.camera,this.renderer.domElement);
    }



    animate=()=>
    {
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

let game=new Shadow();