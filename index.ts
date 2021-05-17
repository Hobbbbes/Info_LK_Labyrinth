import Player from "./player.js"
import Room_Draw from "./room.js";
import {Agent} from "./Agent/AgentenKlasse.js"
import Spiel from "./spiel.js"
import {LeftWallStrategy} from "./strategy/LeftWallStrategy.js"
import {AgressivStrategy} from "./strategy/AgressivStrategy.js"
import {LeftWallStrategyAndMostlyPacifistStrategy} from "./strategy/LeftWallStrategyAndPacifist.js"
import {RndStrategy} from "./strategy/RndStrategy.js"
import { Direction, Strategy } from "./strategy/Strategy.js";
import { Room } from "./raum.js";

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const canvas = document.querySelector('canvas[id="1"') as HTMLCanvasElement;
const stats = document.getElementById("1.1") as HTMLParagraphElement;
const StrategySelect = document.getElementById("strategy") as HTMLSelectElement;
const coordParagraph = document.getElementById("1.2") as HTMLParagraphElement;
let autorunLever = document.getElementById('autorun');
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
var middle = new Room_Draw(false,false,300,200);
var up = new Room_Draw(false,false,300,100,2);
var down = new Room_Draw(false,true,300,300);
var p = new Player("sprites/adventurer-idle-",270,170,3);
var pAttack = new Player("sprites/adventurer-attack1-",270,170,4);
var pRun = new Player("sprites/adventurer-run-",270,170,4)
var autorun = false;

var breite:number = parseInt(urlParams.get("breite"), 10);
var höhe = parseInt(urlParams.get("höhe"), 10);
var monster = parseInt(urlParams.get("monster"), 10);
var sword = parseInt(urlParams.get("sword"), 10);

//setzte defaultwerte, falls keine parameter übergeben wurden
if(isNaN(breite)){
  breite = 20;
}

if(isNaN(höhe)){
  höhe = 20;
}

if(isNaN(monster)){
  monster = 20;
}

if(isNaN(sword)){
  sword = 20;
}

console.log("h: " + höhe);

var S = new Spiel(höhe, breite, monster, sword)
var A : Agent

var agentToRender = p;
setInterval(() => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  middle.draw();
  right.draw();
  left.draw();
  
  up.draw();
  down.draw();
  agentToRender.draw();
},16)


document.body.appendChild(canvas);
//npm run dev
let startX = pRun.x
let startY = pRun.y

function NewNeigbours(){
  var n = S.neighbours(A.ID);
  if (n[0] != undefined){
    up = new Room_Draw(n[0].Sword>0,n[0].Monster>0,up.x,up.y,1)
  } else {
    up = new Room_Draw(false,false,up.x,up.y)
  }
  if (n[1] != undefined){
    right = new Room_Draw(n[1].Sword>0,n[1].Monster>0,right.x,right.y,2)
  } else {
    right = new Room_Draw(false,false,right.x,right.y)
  }
  if (n[2] != undefined){
    down = new Room_Draw(n[2].Sword>0,n[2].Monster>0,down.x,down.y,3)
  } else {
    down = new Room_Draw(false,false,down.x,down.y)
  }
  if (n[3] != undefined){
    left = new Room_Draw(n[3].Sword>0,n[3].Monster>0,left.x,left.y,4)
  } else {
    left = new Room_Draw(false,false,left.x,left.y)
  }
  var stat = S.getStatus(A.ID)
  stats.innerText = "HP: " + stat.HP + "     SwordStrenght: " + stat.SwordStrenght;
  coordParagraph.innerText = "x: " + stat.Pos[1] + "  y: " + stat.Pos[0];
  if (stat.finish){
    stats.innerText = "You found the exit";
  }
}

function Step(){
  
  console.log(StrategySelect.value)
  var dir = A.step();
  if (dir === false){
    stats.innerText = "You died";
    return
  }
  agentToRender = pRun;
  dir = dir as Direction
  for(var i : number = 0; i<100;i++){
    
    setTimeout(() => {
      if (dir === Direction.Down){
        pRun.y += 1;
      } else if(dir === Direction.Left){
        pRun.x -= 1;
      } else if(dir === Direction.Right){
        pRun.x += 1;
      } else if(dir === Direction.Up){
        pRun.y -= 1;
      }
    }, 16*i)
  }
  setTimeout(() =>  {  
    pRun.x = startX
    pRun.y = startY
    agentToRender = p
    NewNeigbours();
    
    if(autorun){
      setTimeout(() => {
        Step();
      }, 500);
    }

  },16*100)
}

function newPlayer(){
  var strategy : Strategy;
  if(StrategySelect.value === "Agressiv"){
    strategy = new AgressivStrategy(breite);
  } else if(StrategySelect.value === "LeftWall"){
    strategy = new LeftWallStrategy(breite);
  } else if(StrategySelect.value === "LeftWallPacifist"){
    strategy = new LeftWallStrategyAndMostlyPacifistStrategy(breite);
  } else {
    strategy = new RndStrategy(breite);
  }
  A = new Agent(S.createAgent(),breite, höhe, S,strategy);
  NewNeigbours();
}

autorunLever.addEventListener('change',function(){
  autorun = !autorun;
});
document.querySelector('button[type=step]',).addEventListener('click',Step)
document.querySelector('button[type=new_player]',).addEventListener('click',newPlayer)

//http://localhost:5000/?breite=5&höhe=4&monster=5&sword=7