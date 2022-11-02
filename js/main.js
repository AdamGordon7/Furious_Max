import { Game } from "./game.js";


//class holds the choices selected by the user
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

let carSelection;
let trackSelection;
let cameraChoice;

let choices=new Choices();


//car selection
//mclaren
document.getElementById("select-mclaren").addEventListener("click", function(event){
    document.getElementById("ID_select_car").style.display="none";
    document.getElementById("ID_select_track").style.display="block";
    carSelection="mclaren";
    choices.setCarChoice(carSelection);

});

//redbull
document.getElementById("select-redbull").addEventListener("click", function(event){
    document.getElementById("ID_select_car").style.display="none";
    document.getElementById("ID_select_track").style.display="block";
    carSelection="redbull"
    choices.setCarChoice(carSelection);

});

//ferrari
document.getElementById("select-ferrari").addEventListener("click", function(event){
    document.getElementById("ID_select_car").style.display="none";
    document.getElementById("ID_select_track").style.display="block";
    carSelection="ferrari";
    choices.setCarChoice(carSelection);

});

//track selection
//Marina track
document.getElementById("select-marina").addEventListener("click", function(event){
  document.getElementById("ID_select_track").style.display="none";
  document.getElementById("loading-screen").style.display="none";
  document.getElementById("ID_select_view").style.display="flex";
    trackSelection=1;
    choices.setTrackChoice(trackSelection);

});

//Desert track
document.getElementById("select-desert").addEventListener("click", function(event){
  document.getElementById("ID_select_track").style.display="none";
  document.getElementById("loading-screen").style.display="none";
  document.getElementById("ID_select_view").style.display="flex";
    trackSelection=2;
    choices.setTrackChoice(trackSelection);

});

//forest track
document.getElementById("select-forest").addEventListener("click", function(event){
    document.getElementById("ID_select_track").style.display="none";
    document.getElementById("loading-screen").style.display="none";
    document.getElementById("ID_select_view").style.display="flex";
    trackSelection=3;
    choices.setTrackChoice(trackSelection);

});

//first person selection
//set views to none and start a new game with selected choices
document.getElementById("first-person").addEventListener("click", function(event){
  document.getElementById("loading-screen").style.display="none";
  document.getElementById("ID_select_view").style.display="none";
  cameraChoice="1";
  choices.setCameraChoice(cameraChoice);
  let newGame = new Game(choices.getCarChoice(),choices.getTrackChoice(),choices.getCameraChoice());

});

//third person selection
//set views to none and start a new game with selected choices
document.getElementById("third-person").addEventListener("click", function(event){
  document.getElementById("loading-screen").style.display="none";
  document.getElementById("ID_select_view").style.display="none";
  cameraChoice="3";
  choices.setCameraChoice(cameraChoice);
  let newGame = new Game(choices.getCarChoice(),choices.getTrackChoice(),choices.getCameraChoice());

});

//leader board return to home button
document.getElementById("leader-back-start-button").addEventListener("click", function(event){
  window.location.reload();
});

//in game menu quir button
document.getElementById("quit-button").addEventListener("click", function(event){
  window.location.reload();
});

//out of bounds menu quit button
document.getElementById("quit-button-out-bounds").addEventListener("click", function(event){
  window.location.reload();
});

