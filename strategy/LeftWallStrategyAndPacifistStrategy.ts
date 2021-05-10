
import {Strategy, Direction, Visited} from "./Strategy.js"
import {Room} from "../raum.js";

export class LeftWallStrategyAndMostlyPacifistStrategy extends Strategy{
  
  protected orderByPreferences(pos:[number, number], availableDirections:Direction[], hp:number, ap:number):Direction[]{
    
    //sollte schon sortiert sein, aber falls sich die reihenfolge ändert, würde es sonst nicht mehr funktionieren
    availableDirections.sort((a, b) => a - b);
    
    let lastDirection;
    let lastDirInd = -1;
    
    lastDirection = super.getDirectionToRoomBeforeFromCoords(pos);
    if(lastDirection != null){
      lastDirInd = availableDirections.indexOf(lastDirection);
    }
    
    let directions:Direction[] = [];
    for(var i = 1; i <= availableDirections.length; i++){
      directions.push(availableDirections[(lastDirInd+i) % availableDirections.length]);
    }

    for(let direction of availableDirections) {
      let roomNum = super.getRoomNumFromDirection(pos, direction);
      let room:Room = this.visitedRooms[roomNum][0];

      if(room.monster > 0){
        if(room.monster - ap >= hp){
          this.visitedRooms[roomNum][2] = Math.max(Visited.Monster_invincible, this.visitedRooms[roomNum][2]);
        }else{
          this.visitedRooms[roomNum][2] = Math.max(Visited.Monster, this.visitedRooms[roomNum][2]);
        }
      }
    }
    
    return directions;
  }
} 