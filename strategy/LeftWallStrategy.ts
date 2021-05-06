
import {Strategy} from "./Strategy"
import {Room} from ?;
import {Direction} from "./Strategy";

export class LeftWallStrategy extends Strategy{
  
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
      directions.push(sortedDirections[(lastDirInd+i) % sortedDirections.length]);
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