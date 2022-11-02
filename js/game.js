import * as THREE from "../modules/three.module.js";
import{GLTFLoader} from "../modules/GLTFLoader.js";
import{SceneMarina} from "../js/sceneMarina.js";
import{SceneDesert} from "../js/sceneDesert.js";
import { SceneForrest } from "./sceneForrest.js";

export class Game{

    constructor(carChoice, trackChoice,cameraChoice)
    {
        this.startGame();
        if(trackChoice==1)
        {
            this.marinaScene=new SceneMarina(carChoice,cameraChoice);
        }
        else if(trackChoice==2)
        {
            this.desertScene=new SceneDesert(carChoice,cameraChoice);    
        }
        else if(trackChoice==3)
        {
            this.forrestScene=new SceneForrest(carChoice,cameraChoice);
        }


        this.lapCount=0;
        this.won=false;
        this.timeOut=false;
    }

    startGame()
    {
        document.querySelector(".in-game-menu-container-outer").style.display="flex"
    }
}


// chrck pyrmind construction in notes  add shading  adn texture
//scale rotate tramns