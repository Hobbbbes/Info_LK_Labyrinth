
import {Strategy, Direction, Visited} from "./Strategy.js"
import {Room} from "../raum.js";
import {roomNumToCoords, coordsToRoomNum} from "../utils/CoordConverter.js";

export class AgressivStrategy extends Strategy{

  public orderByPreferences(pos:[number, number], availableDirections:Direction[], hp:number, ap:number):Direction[]{
    availableDirections.sort((a, b) => {

      let room_a = super.getRoomFromDirection(pos, a); 
      let room_b = super.getRoomFromDirection(pos, b);;
      let lastDIrection = super.getDirectionToRoomBeforeFromCoords(pos);
      let directionSort = a == lastDIrection ? 1 :( b == lastDIrection ? -1 : (a - b));
      //console.log(lastDIrection);
      //console.log(a + "  b:" + b + "   sort:" + directionSort);
      let monsterSort = room_a.monster - room_b.monster;
      let swordSort = room_b.sword - room_a.sword;

      if(room_a.sword <= ap && room_b.sword <= ap){
        swordSort = 0;
      }

      if(room_a.monster == 0 || room_b.monster == 0){
        monsterSort = 0;
      }

      if(swordSort == 0){
        if(monsterSort == 0){
          //console.log("dirSort: " + directionSort);
          return directionSort;
        }else{
          //console.log("monstsort: " + monsterSort + " a:" + room_a.monster + " b:" + room_b.monster);
          return monsterSort;
        }
      }else{
        //console.log("swordSort: " + swordSort + " a:" + room_a.sword + " b:" + room_b.sword);
        return swordSort;
      }
    });
    
    for(let direction of availableDirections){
      let roomNum = coordsToRoomNum(super.getCoordsFromDirection(pos, direction), this.breite);
      let room:Room = this.visitedRooms[roomNum][0];
      
      if(room.monster - ap >= hp){
        this.visitedRooms[roomNum][2] = Math.max(Visited.Monster_invincible, this.visitedRooms[roomNum][2]);
      }
    }
    return availableDirections;
  }
} 