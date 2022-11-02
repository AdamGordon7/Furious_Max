import { Game } from "./game.js";

class Choices
{
  constructor()
  {
      this.carChoice;
      this.trackChoice;
      this.cameraChoice;
  }

  setCarChoice(carChoice)
  {
    this.carChoice=carChoice;
  }

  setTrackChoice(trackChoice)
  {
    this.trackChoice=trackChoice;
  }

  setCameraChoice(cameraChoice)
  {
    this.cameraChoice=cameraChoice;
  }

  getCarChoice()
  {
    return this.carChoice;
  }

  getTrackChoice()
  {
    return this.trackChoice;
  }

  getCameraChoice()
  {
    return this.cameraChoice;
  }

}

let carChoice;
let trackChoice;
let CameraChoice;
let choices=new Choices();
choices.setCameraChoice("3");

var raceButton=document.getElementById("race_button");

//on race click-> take to track selection
raceButton.addEventListener("click",function(event){
  document.querySelector(".menu-buttons").style.display="none";
  document.querySelector("#track-div").style.display="block";
});

//on car click takar to race
var confirmTrack=document.getElementById("confirm-track-selection")
confirmTrack.addEventListener("click",function(event){
  document.querySelector("#track-div").style.display="none";
  document.querySelector("#car-div").style.display="block";
  choices.setTrackChoice(trackChoice);
});

var confirmCar=document.getElementById("confirm-car-selection")
confirmCar.addEventListener("click",function(event){
  document.querySelector("#car-div").style.display="none";
  choices.setCarChoice(carChoice);


  let newGame = new Game(choices.getCarChoice(),choices.getTrackChoice(),choices.getCameraChoice());


});

//select track
var track1=document.getElementById("track-1");
track1.addEventListener("click",function onClick(event){
  track1.style.backgroundColor="#33363692";
  track2.style.backgroundColor="#ffffff00";
  track3.style.backgroundColor="#ffffff00";
  trackChoice=1;
});

var track2=document.getElementById("track-2");
track2.addEventListener("click",function onClick(event){
  track2.style.backgroundColor="#33363692";
  track1.style.backgroundColor="#ffffff00";
  track3.style.backgroundColor="#ffffff00";
  trackChoice=2;
});

var track3=document.getElementById("track-3");
track3.addEventListener("click",function onClick(event){
  track3.style.backgroundColor="#33363692";
  track1.style.backgroundColor="#ffffff00";
  track2.style.backgroundColor="#ffffff00";
  trackChoice=3;
});

//select car
var ferrari=document.getElementById("ferrari");
ferrari.addEventListener("click",function onClick(event){
  ferrari.style.backgroundColor="#33363692";
  mclaren.style.backgroundColor="#ffffff00";
  redbull.style.backgroundColor="#ffffff00";
  carChoice="ferrari"
});

var redbull=document.getElementById("redbull");
redbull.addEventListener("click",function onClick(event){
  redbull.style.backgroundColor="#33363692";
  ferrari.style.backgroundColor="#ffffff00";
  mclaren.style.backgroundColor="#ffffff00";
  carChoice="redbull"
});

var mclaren=document.getElementById("mclaren");
mclaren.addEventListener("click",function onClick(event){
  mclaren.style.backgroundColor="#33363692";
  ferrari.style.backgroundColor="#ffffff00";
  redbull.style.backgroundColor="#ffffff00";
  carChoice="mclaren"
});


var quitBtn=document.getElementById("quit-button");
quitBtn.addEventListener("click",function onClick(event){
  window.location.reload();
});
