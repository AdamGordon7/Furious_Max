import * as THREE from "../modules/three.module.js";

export class Timer{

    constructor(scene, SceneHandler)
    {
        this.scene=scene;
        this.SceneHandler=SceneHandler;
    }

    // timer()
    // {
    //     setTimeout(()=>{
    //         window.alert("Time Up");
    //     },180000);
    // }

    setTimer(duration,display)
    {
        //this.timer();
        var timer=duration,minutes,seconds;
        setInterval(()=>{
            minutes = parseInt(timer / 60, 10);
            seconds = parseInt(timer % 60, 10);
      
            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;
      
            display.textContent = minutes + ":" + seconds;

            if (--timer < 0) {
                timer = duration;
            }
        },1000);
    }

    startTimer()
    {
        var display=document.getElementById("timer");
        this.setTimer(60*3,display);
        this.clock=new THREE.Clock();
    }
    getTime()
    {
        return this.clock.getElapsedTime();
    }
}