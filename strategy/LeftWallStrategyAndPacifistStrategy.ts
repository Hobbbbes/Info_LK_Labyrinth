
import {Strategy, Direction, Visited} from "./Strategy"
import {Room} from ?;
import {roomNumToCoords, coordsToRoomNum} from "../utils/CoordConverter";

export class LeftWallStrategyAndMostlyPacifistStrategy extends Strategy{
  
  public orderByPreferences(pos:[number, number], availableRooms:Room[], availableDirections:Direction[], hp:number, ap:number):Direction[]{
    
    let sortedDirections = Object.assign([], availableDirections);
    sortedDirections.sort((a, b) => this.getNewValueForDirection(a)-this.getNewValueForDirection(b));
    
    let lastDirection;
    let lastDirInd = -1;

    lastDirection = super.getDirectionToLastRoom(pos);
    if(lastDirection){
      lastDirInd = sortedDirections.indexOf(lastDirection);
    }
    
    let directions:Direction[] = [];
    for(var i = 1; i <= sortedDirections.length; i++){
      let roomNum = coordsToRoomNum(super.getPosFromDirection(pos, sortedDirections[i]), super.breite);
      let room:Room = super.visitedRooms[roomNum][0];

      if(room.monster > 0){
        if(room.monster - ap >= hp){
          super.visitedRooms[roomNum][2] = Visited.Visited_monster_invincible;
        }else{
          super.visitedRooms[roomNum][2] = Visited.Visited_monster;
        }
      }else{
        directions.push(sortedDirections[(lastDirInd+i) % sortedDirections.length]);
      }
    }
    
    return directions;
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