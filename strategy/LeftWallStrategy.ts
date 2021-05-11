
import {Strategy, Direction} from "./Strategy.js"
import {coordsToRoomNum} from "../utils/CoordConverter.js"

export class LeftWallStrategy extends Strategy{

  protected orderByPreferences(pos:[number, number], availableDirections:Direction[], hp:number, ap:number):Direction[]{
    
    //sollte schon sortiert sein, aber falls sich die reihenfolge ändert, würde es sonst nicht mehr funktionieren
    availableDirections.sort((a, b) => a - b);
    
    let lastDirInd = -1;
    let lastDirection = super.getDirectionToLastVisitedRoom();
    if(lastDirection != null){
      lastDirInd = availableDirections.indexOf(lastDirection);
    }
    
    let directions:Direction[] = [];
    for(var i = 1; i <= availableDirections.length; i++){
      directions.push(availableDirections[(lastDirInd+i) % availableDirections.length]);
    }
    
    return directions;
  }
} 