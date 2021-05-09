
import {Strategy} from "./Strategy.js"
import {Room} from "../raum.js";
import {Direction} from "./Strategy.js";

export class LeftWallStrategy extends Strategy{

  protected orderByPreferences(pos:[number, number], availableDirections:Direction[], hp:number, ap:number):Direction[]{
    
    //sollte schon sortiert sein, aber falls sich die reihenfolge ändert, würde es sonst nicht mehr funktionieren
    availableDirections.sort((a, b) => a - b);
    
    let lastDirection;
    let lastDirInd = -1;

    lastDirection = super.getDirectionToRoomBeforeFromCoords(pos);
    if(lastDirection){
      lastDirInd = availableDirections.indexOf(lastDirection);
    }
    
    let directions:Direction[] = [];
    for(var i = 1; i <= availableDirections.length; i++){
      directions.push(availableDirections[(lastDirInd+i) % availableDirections.length]);
    }
    
    return directions;
  }
} 