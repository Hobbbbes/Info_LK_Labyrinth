import Spiel from "./spiel.js";
import {Status} from "./status.js";
import {Agent} from "./Agent/AgentenKlasse.js";
import { LeftWallStrategyAndMostlyPacifistStrategy } from "./strategy/LeftWallStrategyAndPacifistStrategy.js";
import { AgressivStrategy } from "./strategy/AgressivStrategy.js";
import { coordsToRoomNum, roomNumToCoords } from "./utils/CoordConverter.js";
import { RndStrategy } from "./strategy/RndStrategy.js";
import { LeftWallStrategy } from "./strategy/LeftWallStrategy.js";

let breite = 10;
let höhe = 10
let spiel = new Spiel(höhe, breite, 20, 20);
let agentId = spiel.createAgent();
let agent = new Agent(agentId, breite, höhe, spiel, new LeftWallStrategy(breite));
spiel.show();
let hp = spiel.getStatus(agentId).hp;
let i = 0;
try{
while(!spiel.getStatus(agentId).finish && spiel.getStatus(agentId).hp > 0){

    nextStep(agent, spiel);
    /*if(i%100 == 0){
        console.log(agent.s.visitedRooms);
        spiel.show();
    }
    i++;
*/
    console.log("_____________________________________");
}
}catch (e){
    spiel.show();
    console.log(agent.s.visitedRooms);
    let status = spiel.getStatus(agentId);
    console.log(status.hp + " ap:" + status.ap)
    throw e;
}
console.log(hp);
console.log(agent.s.visitedRooms);
let status = spiel.getStatus(agentId);
console.log(`hp=${status.hp}`);
console.log(`finished=${status.finish}`);

function nextStep(agent:Agent, spiel:Spiel) {
    //console.clear();
    console.log("\r\r\r");
    console.log("does Agent make an step?:" + agent.step());
    console.log(spiel.getStatus(agentId).room);
    spiel.show();
}