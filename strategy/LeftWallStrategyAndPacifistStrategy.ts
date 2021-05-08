
import {Strategy, Direction, Visited} from "./Strategy"
import {Room} from ?;
import {LeftWallStrategy} from "./LeftWallStrategy";

export class LeftWallStrategyAndMostlyPacifistStrategy extends LeftWallStrategy{
  
  protected filterDirections(pos:[number, number], neighbourRooms:Room[], availableDirections:Direction[], hp:number, ap:number):Direction[]{

    return availableDirections.filter(direction => {
      let roomNum = super.getRoomNumFromDirection(pos, direction);
      let room:Room = super.visitedRooms[roomNum][0];

      if(room.Monster > 0){
        if(room.Monster - ap >= hp){
          super.visitedRooms[roomNum][2] = Visited.Monster_invincible;
        }else{
          super.visitedRooms[roomNum][2] = Visited.Monster;
        }
          return false;
      }
      return true;
    });
  }
} 