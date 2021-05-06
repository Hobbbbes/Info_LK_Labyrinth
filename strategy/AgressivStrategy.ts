
import {Strategy, Direction, Visited} from "./Strategy"
import {Room} from ?;
import {roomNumToCoords, coordsToRoomNum} from "../utils/CoordConverter";

export class AgressivStrategy extends Strategy{
  
  public orderByPreferences(pos:[number, number], availableRooms:Room[], availableDirections:Direction[], hp:number, ap:number):Direction[]{
    
    let sortedDirections = Object.assign([], availableDirections);
    sortedDirections.sort((a, b) => {

      let room_a = availableRooms[availableDirections.indexOf(a)]; 
      let room_b = availableRooms[availableDirections.indexOf(b)];
      
      let directionSort = this.getNewValueForDirection(a) - this.getNewValueForDirection(b);
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

    for(let i = sortedDirections.length-1; i >= 0; i++){
      let roomNum = coordsToRoomNum(super.getPosFromDirection(pos, sortedDirections[i]), super.breite);
      let room:Room = super.visitedRooms[roomNum][0];

      if(room.monster - ap >= hp){
        super.visitedRooms[roomNum][2] = Visited.Visited_monster_invincible;
        sortedDirections.splice(i, 1);
      }
    }
    
    return sortedDirections;
  }

  private getNewValueForDirection(direction:Direction){
    switch(direction){
      case Direction.Up:{
        return 0;
      }
      case Direction.Right:{
        return 1;
      }
      case Direction.Down:{
        return 2;
      }
      case Direction.Left:{
        return 3;
      }
    }
  }
} 