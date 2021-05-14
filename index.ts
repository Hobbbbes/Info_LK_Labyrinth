import Player from "./player.js"
import Room_Draw from "./room.js";
import {Agent} from "./Agent/AgentenKlasse.js"
import Spiel from "./spiel.js"
import {LeftWallStrategy} from "./strategy/LeftWallStrategy.js"
import {AgressivStrategy} from "./strategy/AgressivStrategy.js"
import {LeftWallStrategyAndMostlyPacifistStrategy} from "./strategy/LeftWallStrategyAndPacifistStrategy.js"
import {RndStrategy} from "./strategy/RndStrategy.js"


const canvas = document.querySelector('canvas[class="1"') as HTMLCanvasElement;
canvas.width = 600;
canvas.height = 600;

const ctx = canvas.getContext("2d");
ctx.fillStyle = "#a86b32";
ctx.imageSmoothingEnabled = false;



Player.setContext(ctx);
Room_Draw.setContext(ctx);
Room_Draw.setSprites(document, "sprites/bricksx64.png","sprites/Sword.png","sprites/Skelet-",6);


var left = new Room_Draw(true,true,200,200);
var right = new Room_Draw(false,true,400,200);
var middle = new Room_Draw(true,false,300,200);
var up = new Room_Draw(false,false,300,100,2);
var down = new Room_Draw(false,true,300,300);
var p = new Player("sprites/adventurer-idle-",270,170,3);
var pAttack = new Player("sprites/adventurer-attack1-",270,170,4);
var pRun = new Player("sprites/adventurer-run-",270,170,4)

var S = new Spiel(50,50,1,1)
var A = new Agent(S.createAgent(),50,50,S,new LeftWallStrategyAndMostlyPacifistStrategy(20));

var agentToRender = p;
setInterval(() => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  right.draw();
  left.draw();
  middle.draw();
  up.draw();
  down.draw();
  agentToRender.draw();
},16)


document.body.appendChild(canvas);
//npm run dev


function Step(){
  agentToRender = pRun;
  A.step();
  var n = S.neighbours(A.ID);
  for(var i : number = 0; i<100;i++){
    setTimeout(() => {
      
    }, 100)
  }
}
document.querySelector('button[type=step]',).addEventListener('click',Step)