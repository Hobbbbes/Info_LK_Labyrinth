import Player from "./player.js"
import Room from "./room.js"
const canvas = document.createElement("canvas");
canvas.width = 600;
canvas.height = 600;
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
Player.setContext(ctx);
Room.setContext(ctx);
Room.setSprites(document, "sprites/bricksx64.png","sprites/Sword.png","sprites/Skelet-",6);
var left = new Room(true,true,200,200);
var right = new Room(false,true,400,200);
var middle = new Room(true,false,300,200);
var up = new Room(false,false,300,100);
var down = new Room(false,true,300,300);
var p = new Player("sprites/adventurer-idle-",document,270,170,3);
var pAttack = new Player("sprites/adventurer-attack1-",document,270,170,4);
var pRun = new Player("sprites/adventurer-run-",document,270,170,4)
setInterval(() => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  right.draw();
  left.draw();
  middle.draw();
  up.draw();
  down.draw();
  pAttack.draw();
  left.fight = true;
},16)

/*
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") x += 10;
  if (event.key === "ArrowLeft") x -= 10;
  if (event.key === "ArrowUp") y -= 10;
  if (event.key === "ArrowDown") y += 10;
});
*/
document.body.appendChild(canvas);
//npm run dev