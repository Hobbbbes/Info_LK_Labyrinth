
import {Strategy, Direction, Visited} from "./Strategy.js"
import {Room} from "../raum.js";
import { coordsToRoomNum } from "../utils/CoordConverter.js";

export class LeftWallStrategyAndMostlyPacifistStrategy extends Strategy{
  
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

    for(let direction of availableDirections) {
      let roomNum = super.getRoomNumFromDirection(pos, direction);
      let room:Room = this.visitedRooms[roomNum][0];

      if(room.monster > 0){
        if(room.monster - ap >= hp && room.monster - room.sword >= hp){
          this.visitedRooms[roomNum][2] = Math.max(Visited.Monster_invincible, this.visitedRooms[roomNum][2]);
        }else{
          this.visitedRooms[roomNum][2] = Math.max(Visited.Monster, this.visitedRooms[roomNum][2]);
        }
      }
    }
    
    return directions;
  }
} 