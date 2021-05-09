
import {Strategy, Direction, Visited} from "./Strategy"
import {Room} from "../raum";
import {LeftWallStrategy} from "./LeftWallStrategy";

export class LeftWallStrategyAndMostlyPacifistStrategy extends Strategy{
  
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

    for(let direction of availableDirections) {
      let roomNum = super.getRoomNumFromDirection(pos, direction);
      let room:Room = super.visitedRooms[roomNum][0];

      if(room.Monster > 0){
        if(room.Monster - ap >= hp){
          super.visitedRooms[roomNum][2] = Math.max(Visited.Monster_invincible, super.visitedRooms[roomNum][2]);
        }else{
          super.visitedRooms[roomNum][2] = Math.max(Visited.Monster, super.visitedRooms[roomNum][2]);
        }
      }
    }
    
    return directions;
  }
} 