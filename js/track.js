import * as THREE from "../modules/three.module.js";
import * as CANNON from "../modules/cannon-es.js";
import * as YUKA from "../modules/yuka.module.js";
import CannonDebugger from "../modules/cannon-es-debugger.js";
import{OrbitControls}from"../modules/OrbitControls.js";
import{GLTFLoader} from "../modules/GLTFLoader.js";
import{ControlsInput} from "/js/controlls.js";

export class Track
{
    constructor(scene,cannonWorld,track_num,loadingManager)
    {
        //setup scene and cannonworld
        this.scene=scene;
        this.cannonWorld=cannonWorld;
        this.loadingManager=loadingManager;
        this.gltfLoader=new GLTFLoader(this.loadingManager);

        if(track_num==1)
        {
            this.constructTrack1();
        }
        else if(track_num==2)
        {
            this.constructTrack2();
        }
        else
        {
            this.constructTrack3();
        }


    }

    constructTrack1()
    {
        let road1;
        this.gltfLoader.load('./assets/track_pieces_final/straight.glb',(gltf)=>{
        var mesh=gltf.scene;
        mesh.position.set(0,0,-21);
        mesh.scale.set(5,5,21.5);
        this.scene.add(mesh);
        road1=mesh;
        });

        //corner 1
        let corner1;
        this.gltfLoader.load('./assets/track_pieces_final/corner.gltf',(gltf)=>{
        var mesh=gltf.scene;
        corner1=mesh;
        mesh.position.set(48.1,0,399.5);
        mesh.scale.set(5,5,5);
        this.scene.add(mesh);
        });

        let corner2;
        this.gltfLoader.load('./assets/track_pieces_final/corner.gltf',(gltf)=>{
        var mesh=gltf.scene;
        corner2=mesh;
        mesh.position.set(180.5,0,445.3);
        mesh.scale.set(-5,5,-5);
        this.scene.add(mesh);
        });

        let road8;
        this.gltfLoader.load('./assets/track_pieces_final/straight.glb',(gltf)=>{
        var mesh=gltf.scene;
        road8=mesh;
        mesh.position.set(224.48,0,708.5);
        mesh.scale.set(5,5,12);
        this.scene.add(mesh);
        });

        let corner3;
        this.gltfLoader.load('./assets/track_pieces_final/corner.gltf',(gltf)=>{
        var mesh=gltf.scene;
        corner3=mesh;
        mesh.position.set(272.65,0,984);
        mesh.scale.set(5,5,5);
        this.scene.add(mesh);
        });

        let road11;
        this.gltfLoader.load('./assets/track_pieces_final/straight.glb',(gltf)=>{
        var mesh=gltf.scene;
        road11=mesh;
        mesh.position.set(483.8,0,1009.3);
        mesh.rotateY(1.567)
        mesh.scale.set(5,5,10);
        this.scene.add(mesh);
        });
        
        let road12;
        this.gltfLoader.load('./assets/track_pieces_final/straight.glb',(gltf)=>{
        var mesh=gltf.scene;
        road11=mesh;
        mesh.position.set(783.5,0,1010.3);
        mesh.rotateY(1.567)
        mesh.scale.set(5,5,10);
        this.scene.add(mesh);
        });

        let corner4;
        this.gltfLoader.load('./assets/track_pieces_final/corner.gltf',(gltf)=>{
            var mesh=gltf.scene;
            corner4=mesh;
            mesh.position.set(1028.1,0,962.9);
            mesh.rotateY(1.57);
            mesh.scale.set(5,5,5);
            this.scene.add(mesh);
            });

        let road13;
        this.gltfLoader.load('./assets/track_pieces_final/straight.glb',(gltf)=>{
        var mesh=gltf.scene;
        road13=mesh;
        mesh.position.set(1049.1,0,509);
        mesh.scale.set(5,5,25);
        this.scene.add(mesh);
        });

        let corner5;
        this.gltfLoader.load('./assets/track_pieces_final/corner.gltf',(gltf)=>{
            var mesh=gltf.scene;
            corner5=mesh;
            mesh.position.set(1074,0,80.2);
            mesh.rotateY(-1.57);
            mesh.scale.set(5,5,5);
            this.scene.add(mesh);
            });

        let road18;
        this.gltfLoader.load('./assets/track_pieces_final/straight.glb',(gltf)=>{
        var mesh=gltf.scene;
        road18=mesh;
        mesh.position.set(1307,0,29);
        mesh.rotateY(1.62);
        mesh.scale.set(5,5,10);
        this.scene.add(mesh);
        });

        let corner6;
        this.gltfLoader.load('./assets/track_pieces_final/corner.gltf',(gltf)=>{
            var mesh=gltf.scene;
            corner6=mesh;
            mesh.position.set(1548.8,0,-31);
            mesh.rotateY(1.62);
            mesh.scale.set(5,5,5);
            this.scene.add(mesh);
            });


        let road20;
        this.gltfLoader.load('./assets/track_pieces_final/straight.glb',(gltf)=>{
        var mesh=gltf.scene;
        road20=mesh;
        mesh.position.set(1558.7,0,-253);
        mesh.rotateY(0.05);
        mesh.scale.set(5,5,10);
        this.scene.add(mesh);
        });


        let corner7;
        this.gltfLoader.load('./assets/track_pieces_final/corner.gltf',(gltf)=>{
            var mesh=gltf.scene;
            corner7=mesh;
            mesh.position.set(1527.5,0,-463);
            mesh.rotateY(1.62);
            mesh.scale.set(-5,5,5);
            this.scene.add(mesh);
            });


        let road21;
        this.gltfLoader.load('./assets/track_pieces_final/straight.glb',(gltf)=>{
        var mesh=gltf.scene;
        road21=mesh;
        mesh.position.set(1128,0,-488.8);
        mesh.rotateY(1.615);
        mesh.scale.set(5,5,20);
        this.scene.add(mesh);
        });

        let road22;
        this.gltfLoader.load('./assets/track_pieces_final/straight.glb',(gltf)=>{
        var mesh=gltf.scene;
        road21=mesh;
        mesh.position.set(463.6,0,-459.5);
        mesh.rotateY(1.615);
        mesh.scale.set(5,5,24.25);
        this.scene.add(mesh);
        });




        let corner8;
        this.gltfLoader.load('./assets/track_pieces_final/corner.gltf',(gltf)=>{
            var mesh=gltf.scene;
            corner8=mesh;
            mesh.position.set(46.7,0,-422);
            mesh.rotateY(3.16);
            mesh.scale.set(-5,5,5);
            this.scene.add(mesh);
            });
    }

    constructTrack2()
    {
        //main straight
        this.gltfLoader.load('./assets/track_pieces_final/straight.glb',(gltf)=>{
            var mesh=gltf.scene;
            mesh.scale.set(5,5,20);
            this.scene.add(mesh);
        });


        //conrer 1
        this.gltfLoader.load('./assets/track_pieces_final/corner.gltf',(gltf)=>{
            var mesh=gltf.scene;
            mesh.position.set(48.1,0,399.1);
            mesh.scale.set(5,5,5);
            this.scene.add(mesh);
        });

        this.gltfLoader.load('./assets/track_pieces_final/straight.glb',(gltf)=>{
            var mesh=gltf.scene;
            mesh.position.set(258.9,0,424);
            mesh.rotateY(Math.PI/2);
            mesh.scale.set(5,5,10);
            this.scene.add(mesh);
        });

        //corner 2
        this.gltfLoader.load('./assets/track_pieces_final/corner.gltf',(gltf)=>{
            var mesh=gltf.scene;
            mesh.position.set(480.1,0,444.8);
            mesh.scale.set(-5,5,-5);
            this.scene.add(mesh);
        });

        //straight 2
        this.gltfLoader.load('./assets/track_pieces_final/straight.glb',(gltf)=>{
            var mesh=gltf.scene;
            mesh.position.set(524.2,0,824.3);
            mesh.scale.set(5,5,20);
            this.scene.add(mesh);
        });

        //conrner 3
        this.gltfLoader.load('./assets/track_pieces_final/corner.gltf',(gltf)=>{
            var mesh=gltf.scene;
            mesh.position.set(572.3,0,1223.9);
            mesh.scale.set(5,5,5);
            this.scene.add(mesh);
        });

        //straight 3
        this.gltfLoader.load('./assets/track_pieces_final/straight.glb',(gltf)=>{
            var mesh=gltf.scene;
            mesh.position.set(783.6,0,1248.8);
            mesh.rotateY(Math.PI/2)
            mesh.scale.set(5,5,10);
            this.scene.add(mesh);
        });

        //corner 4
        this.gltfLoader.load('./assets/track_pieces_final/corner.gltf',(gltf)=>{
            var mesh=gltf.scene;
            mesh.position.set(1027.5,0,1199.8);
            mesh.rotateY(1.58);
            mesh.scale.set(5,5,5);
            this.scene.add(mesh);
        });

        //straight 4
        this.gltfLoader.load('./assets/track_pieces_final/straight.glb',(gltf)=>{
            var mesh=gltf.scene;
            mesh.position.set(1044.7,0,823.2);
            mesh.rotateY(0.01);
            mesh.scale.set(5,5,20);
            this.scene.add(mesh);
        });

        this.gltfLoader.load('./assets/track_pieces_final/straight.glb',(gltf)=>{
            var mesh=gltf.scene;
            mesh.position.set(1038.7,0,223.5);
            mesh.rotateY(0.01);
            mesh.scale.set(5,5,20);
            this.scene.add(mesh);
        });

        this.gltfLoader.load('./assets/track_pieces_final/straight.glb',(gltf)=>{
            var mesh=gltf.scene;
            mesh.position.set(1032.6,0,-376.2);
            mesh.rotateY(0.01);
            mesh.scale.set(5,5,20);
            this.scene.add(mesh);
        });

        //corner 5 - chicane
        this.gltfLoader.load('./assets/track_pieces_final/corner.gltf',(gltf)=>{
            var mesh=gltf.scene;
            mesh.position.set(984.8,0,-755.3);
            mesh.rotateY(0.01);
            mesh.scale.set(-5,5,-5);
            this.scene.add(mesh);
        });
        this.gltfLoader.load('./assets/track_pieces_final/corner.gltf',(gltf)=>{
            var mesh=gltf.scene;
            mesh.position.set(851.8,0,-799.8);
            mesh.rotateY(0.01);
            mesh.scale.set(5,5,5);
            this.scene.add(mesh);
        });

        //staight 5
        this.gltfLoader.load('./assets/track_pieces_final/straight.glb',(gltf)=>{
            var mesh=gltf.scene;
            mesh.position.set(799.8,0,-1198.8);
            mesh.rotateY(0.01);
            mesh.scale.set(5,5,20);
            this.scene.add(mesh);
        });

        //conrner 6
        this.gltfLoader.load('./assets/track_pieces_final/corner.gltf',(gltf)=>{
            var mesh=gltf.scene;
            mesh.position.set(752,0,-1577.8);
            mesh.rotateY(0.01);
            mesh.scale.set(-5,5,-5);
            this.scene.add(mesh);
        });

        //straight 6
        this.gltfLoader.load('./assets/track_pieces_final/straight.glb',(gltf)=>{
            var mesh=gltf.scene;
            mesh.position.set(376,0,-1595);
            mesh.rotateY(0.01 + Math.PI/2);
            mesh.scale.set(5,5,20);
            this.scene.add(mesh);
        });

        //corner 7->penultimate 
        this.gltfLoader.load('./assets/track_pieces_final/corner.gltf',(gltf)=>{
            var mesh=gltf.scene;
            mesh.position.set(20,0,-1570.55);
            mesh.rotateY(0.01);
            mesh.scale.set(5,5,-5);
            this.scene.add(mesh);
        });

        //straight 7 -home 
        this.gltfLoader.load('./assets/track_pieces_final/straight.glb',(gltf)=>{
            var mesh=gltf.scene;
            mesh.position.set(-30,0,-1191.2);
            mesh.rotateY(-0.01);
            mesh.scale.set(5,5,20);
            this.scene.add(mesh);
        });


        this.gltfLoader.load('./assets/track_pieces_final/straight.glb',(gltf)=>{
            var mesh=gltf.scene;
            mesh.position.set(-16.5,0,-595.4);
            mesh.rotateY(0.05);
            mesh.scale.set(5,5,19.8);
            this.scene.add(mesh);
        });

    }

    constructTrack3()
    {

        //straight 1
        this.gltfLoader.load('./assets/track_pieces_final/straight.glb',(gltf)=>{
            var mesh=gltf.scene;
            mesh.scale.set(5,5,40);
            this.scene.add(mesh);
        });

        this.gltfLoader.load('./assets/track_pieces_final/straight.glb',(gltf)=>{
            var mesh=gltf.scene;
            mesh.position.set(0,0,-889.7);
            mesh.scale.set(5,5,20);
            this.scene.add(mesh);
        });

        this.gltfLoader.load('./assets/track_pieces_final/straight.glb',(gltf)=>{
            var mesh=gltf.scene;
            mesh.position.set(0,0,-1489);
            mesh.scale.set(5,5,20);
            this.scene.add(mesh);
        });

        //conrner 1
        this.gltfLoader.load('./assets/track_pieces_final/corner.gltf',(gltf)=>{
            var mesh=gltf.scene;
            mesh.position.set(48,0,709.5);
            mesh.scale.set(5,5,5);
            this.scene.add(mesh);
        });

        this.gltfLoader.load('./assets/track_pieces_final/straight.glb',(gltf)=>{
            var mesh=gltf.scene;
            mesh.position.set(549.2,0,734.5);
            mesh.rotateY(Math.PI/2)
            mesh.scale.set(5,5,30);
            this.scene.add(mesh);
        });

        this.gltfLoader.load('./assets/track_pieces_final/straight.glb',(gltf)=>{
            var mesh=gltf.scene;
            mesh.position.set(1159.2,0,734.5);
            mesh.rotateY(Math.PI/2)
            mesh.scale.set(5,5,10);
            this.scene.add(mesh);
        });

        //corner 2
        this.gltfLoader.load('./assets/track_pieces_final/corner.gltf',(gltf)=>{
            var mesh=gltf.scene;
            mesh.position.set(1403.2,0,685.5);
            mesh.rotateY(1.58);
            mesh.scale.set(5,5,5);
            this.scene.add(mesh);
        });

        //straight 2
        this.gltfLoader.load('./assets/track_pieces_final/straight.glb',(gltf)=>{
            var mesh=gltf.scene;
            mesh.position.set(1423.4,0,-0.5);
            mesh.scale.set(5,5,40);
            this.scene.add(mesh);
        });

        this.gltfLoader.load('./assets/track_pieces_final/straight.glb',(gltf)=>{
            var mesh=gltf.scene;
            mesh.position.set(1423.4,0,-889.7);
            mesh.scale.set(5,5,20);
            this.scene.add(mesh);
        });

        this.gltfLoader.load('./assets/track_pieces_final/straight.glb',(gltf)=>{
            var mesh=gltf.scene;
            mesh.position.set(1424,0,-1489);
            mesh.scale.set(5,5,20);
            this.scene.add(mesh);
        });

        //conrner 3
        this.gltfLoader.load('./assets/track_pieces_final/corner.gltf',(gltf)=>{
            var mesh=gltf.scene;
            mesh.position.set(1379.8,0,-1868.4);
            mesh.scale.set(-5,5,-5);
            this.scene.add(mesh);
        });

        this.gltfLoader.load('./assets/track_pieces_final/straight.glb',(gltf)=>{
            var mesh=gltf.scene;
            mesh.position.set(549.2,0,-1889.4);
            mesh.rotateY(Math.PI/2)
            mesh.scale.set(5,5,30);
            this.scene.add(mesh);
        });

        this.gltfLoader.load('./assets/track_pieces_final/straight.glb',(gltf)=>{
            var mesh=gltf.scene;
            mesh.position.set(1159.2,0,-1889.4);
            mesh.rotateY(Math.PI/2)
            mesh.scale.set(5,5,10);
            this.scene.add(mesh);
        });

        //corner 4
        this.gltfLoader.load('./assets/track_pieces_final/corner.gltf',(gltf)=>{
            var mesh=gltf.scene;
            mesh.position.set(24.8,0,-1845.3);
            mesh.rotateY(1.57);
            mesh.scale.set(-5,5,-5);
            this.scene.add(mesh);
        });
    }

};