import * as THREE from "../modules/three.module.js";


export class ControlsInput
{
    constructor(delta,timer, sceneHandler)
    {
        this.sceneHandler=sceneHandler;

        this.speed=0;//current speed
        this.maxSpeed=4;//max speed
        this.acceleration=0.25; //acceleration increment 
        this.angle=0;//current angle of where csr is pointing 
        this.moveMade=false;
        this.start=false;
        this.delta=delta;

        this.timerStarted=false;
        this.timer=timer;

        this.init();
    }

    init()
    {
        this.setUpAudio();
        //create object containing different keys
        this.keys={ accelerate: false,
            break: false,
            left: false,
            right: false,
        };

        //add event listeners 
        //e=event 
        //on keyup/down event call respective fucntion
        document.addEventListener('keydown', (e) => this.onKeyDown(e), false);
        document.addEventListener('keyup', (e) => this.onKeyUp(e), false);
    }

    setUpAudio()
    {
        this.listener=new THREE.AudioListener();

        this.lightsOut=new THREE.Audio(this.listener);

        this.audioLoader=new THREE.AudioLoader();
        this.audioLoader.load( './assets/sounds/lightsOut.mp3', ( buffer ) =>{
            this.lightsOut.setBuffer( buffer );
            this.lightsOut.setLoop( false );
            this.lightsOut.setVolume( 0.5 );
        });

        this.rev=new THREE.Audio(this.listener);
        this.audioLoader.load( './assets/sounds/carRev.mp3', ( buffer ) =>{
            this.rev.setBuffer( buffer );
            this.rev.setLoop( true );
            this.rev.setVolume( 0.5 );
        });
    }

    onKeyDown(e)
    {
        switch (e.key) {
            case 'w': // w
                this.keys.accelerate = true;
                this.speed+=this.acceleration
                if(this.timerStarted==false)
                {
                    this.timerStarted=true;
                    this.timer.startTimer();
                }
                if(this.start==false)
                {
                    this.lightsOut.play();
                    this.start=true;
                }
                else
                {
                    if(this.sceneHandler.getPause()==true)
                    {
                        this.rev.stop();
                    }
                    else if(this.sceneHandler.getPause()==false)
                    {
                        this.rev.play();
                    }
                }
                break;

            case 's': // s
                this.keys.break = true;
                this.speed-=this.acceleration;
                if(this.timerStarted==false)
                {
                    this.timerStarted=true;
                    this.timer.startTimer();
                }
                if(this.start==false)
                {
                    this.start=true;
                }
                break;

            case 'a': // a
                this.keys.left = true;
                //this.angle+=0.1*this.delta;
                this.angle+=0.1;
                if(this.timerStarted==false)
                {
                    this.timerStarted=true;
                    this.timer.startTimer();
                }
                if(this.start==false)
                {
                    this.start=true;
                }
                break;

            case 'd': // d
                this.keys.right = true;
                this.angle-=0.1;
                if(this.timerStarted==false)
                {
                    this.timerStarted=true;
                    this.timer.startTimer();
                }
                if(this.start==false)
                {
                    this.start=true;
                }
                break;
        }
    }

    onKeyUp(e){
        switch(e.key) {
          case 'w': // w
            this.keys.accelerate = false;
            break;
          case 'a': // a
            this.keys.left = false;
            break;
          case 's': // s
            this.keys.break = false;
            break;
          case 'd': // d
            this.keys.right = false;
            break;
        }
    }

    getMoveMade()
    {
        return this.moveMade;
    }

    updateDelta(delta)
    {
        this.delta=delta;
    }

    getStartedTimer()
    {
        return this.timerStarted
    }

};