
import {Strategy, Direction, Visited} from "./Strategy"
import {Room} from ?;

export class LeftWallStrategyAndMostlyPacifistStrategy extends Strategy{
  
  public orderByPreferences(pos:[number, number], availableRooms:Room[], availableDirections:Direction[], hp:number, ap:number):Direction[]{
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
      let roomNum = super.getRoomNumFromDirection(pos, availableDirections[i]);
      let room:Room = super.visitedRooms[roomNum][0];

      if(room.monster > 0){
        if(room.monster - ap >= hp){
          super.visitedRooms[roomNum][2] = Visited.Monster_invincible;
        }else{
          super.visitedRooms[roomNum][2] = Visited.Monster;
        }
      }else{
        directions.push(availableDirections[(lastDirInd+i) % availableDirections.length]);
      }
    }
    
    return directions;
  }
} 