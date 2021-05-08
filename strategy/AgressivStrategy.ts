
import {Strategy, Direction, Visited} from "./Strategy"
import {Room} from ?;
import {roomNumToCoords, coordsToRoomNum} from "../utils/CoordConverter";

export class AgressivStrategy extends Strategy{
  
  protected filterDirections(pos:[number, number], neighbourRooms:Room[], availableDirections:Direction[], hp:number, ap:number):Direction[]{

    return availableDirections.filter(direction => {
      let roomNum = coordsToRoomNum(super.getCoordsFromDirection(pos, direction), super.breite);
      let room:Room = super.visitedRooms[roomNum][0];

      if(room.monster - ap >= hp){
        super.visitedRooms[roomNum][2] = Visited.Monster_invincible;
        return false;
      }

      return true;
    });
  }

  public orderByPreferences(pos:[number, number], availableDirections:Direction[], hp:number, ap:number):Direction[]{
    return availableDirections.sort((a, b) => {

      let room_a = super.getRoomFromDirection(pos, a); 
      let room_b = super.getRoomFromDirection(pos, b);;
      
      let directionSort = a - b;
      let monsterSort = room_b.monster - room_a.monster;
      let swordSort = room_a.sword - room_b.sword;

      if(room_a.sword <= ap && room_b.sword <= ap){
        swordSort = 0;
      }

      if(swordSort == 0){
        if(monsterSort == 0){
          return directionSort;
        }else{
          return monsterSort;
        }
      }else{
        return swordSort;
      }
    });
  }
} 