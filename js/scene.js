export class SceneHandler{
    constructor()
    {
        this.pause=false;
        this.won=false;
        this.lost=false;
        this.start=false;
        this.isPlaying=false;
        this.lapCount=0;

        const pauseButton = document.getElementById("pause-button");
        pauseButton.addEventListener("click", ()=>{
                this.handlePause();
                //alert("Game Paused! Click OK to unpause game"); 
            });
        //const restartButton=document.getElementById("restart-button");
        //restartButton.addEventListener("click",()=>{
           // this.handleRestart()
        //})
    }


    handlePause()
    {
        if(this.pause===false)
        {
            this.pause=true;
        }
        else
        {
            this.pause=false;
        }
    }

    getPause()
    {
        console.log("EXEC", this.pause);
        return this.pause;
    }

    handleLapCount()
    {
        this.lapCount+=1;
    }

    handleRestart()
    {
        //call functions in class and set bak to 0
        //lap count, timer etc
    }

    handleQuit()
    {

    }

    handleWin()
    {

    }

    handleLose()
    {
        
    }
}