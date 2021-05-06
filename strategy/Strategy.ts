import {Room} from ?;
import {roomNumToCoords, coordsToRoomNum} from "../utils/CoordConverter";
import {Agent} from "../Agent/AgentenKlasse";


export enum Direction{
  Up = 0,
  Down = 1,
  Left = 2,
  Right = 3
};

export enum Visited{
  Unvisited = 0,
  Visited_unvisited = 1, //path has an empty unvisited neighbourRoom
  Visited_monster = 2, //path has an unvisited neighbourRoom with a monster
  Visited_monster_invincible = 3, //path has an unvisited neighbourRoom with a monster
  Visited_DeadEnd = 4 //path has no unvisited neighbourRooms
}

//Strategy-Konstrukt zum auswählen der Räume
export abstract class Strategy{

  protected breite:number;
  //room, lastRoomNum, visited
  protected visitedRooms:[Room, number, Visited][];

  constructor(breite:number, visitedRooms:[Room, number, number][]){
    this.breite = breite;
    this.visitedRooms = visitedRooms;
  }

  public abstract orderByPreferences(pos:[number, number], neighbourRooms:Room[], availableDirections:Direction[], hp:number, ap:number):Direction[];

  //pos, Nachbarräume 
  public getNextRoom(pos:[number, number], neighbourRooms:Room[], hp:number, ap:number):Room{

    let availableDirections = this.getAvailableDirections(neighbourRooms);
    let availableCoords = this.getAvailableRoomCoords(pos, neighbourRooms);
    let availableRooms = this.getAvailableRooms(neighbourRooms);

    //add rooms to visitedRooms, if they arn't registered 
    //TODO ersten Raum objekt erzeugen
    this.registerRooms(pos, availableRooms, availableCoords);
    
    let directions:Room[] = this.orderByPreferences(pos, availableRooms, availableDirections, hp, ap);

    let nextDirection = this.getNextDirection(pos, directions, availableDirections);

    this.setVisitedState(pos, this.calculateVisitedState(pos, availableCoords, nextDirection));

    return nextDirection;
  }

  protected registerRooms(pos:[number, number], availableNeighbourRooms:Room[], availableCoords:[number, number][]){
    let roomNum = coordsToRoomNum(pos, this.breite);

    if(!this.visitedRooms[roomNum]){
      this.visitedRooms[roomNum] = [null, null, Visited.Unvisited];
    }

    for(let i = 0; i < availableNeighbourRooms.length; i++){
      let nextRoom = availableNeighbourRooms[i];
      let nextRoomNum = coordsToRoomNum(availableCoords[i], this.breite);
      if(!this.visitedRooms[nextRoomNum]){
        this.visitedRooms[nextRoomNum] = [nextRoom, roomNum, Visited.Unvisited];
      }else if(!this.visitedRooms[nextRoomNum][0]){
        this.visitedRooms[nextRoomNum][0] = nextRoom;
      }
    }
    
  }

  protected setVisitedState(pos, visitedState:Visited){
    let roomNum = coordsToRoomNum(pos, this.breite);
    //there is no object for the first room
    this.visitedRooms[roomNum][2] = visitedState;
  }

  protected calculateVisitedState(pos, availableCoords:[number, number][], nextDirection:Direction){
    let visitedState:Visited = Visited.Visited_DeadEnd;
    let nextCoord = this.getPosFromDirection(pos, nextDirection);

    for(let i of availableCoords){
      let neighbourRoomNum = coordsToRoomNum(i, this.breite);
      if(i[0] != nextCoord[0] || i[1] != nextCoord[1]){
        let neighbourVisitedState = this.visitedRooms[neighbourRoomNum][2];
        if(neighbourVisitedState == Visited.Unvisited){
          visitedState = Math.min(visitedState, Visited.Visited_unvisited);
        }else{
          visitedState = Math.min(visitedState, neighbourVisitedState)
        }
      }
    }
    return visitedState;
  }

  protected getNextDirection(pos:[number, number], sortedDirections:Direction[], availableDirections:Direction[]):Direction{

    //try to find an unvisited directon
    for(var d = 0; d < sortedDirections.length; d++){
      if(this.getVisitedForDirection(pos, sortedDirections[d]) == Visited.Unvisited){
        return sortedDirections[d];
      }
    }

    //if there is no unvisited direction:
    //find the direction with the lowest visitedState (> dead end)

    let nextDirection = null;
    let bestVisitedState = Visited.Visited_DeadEnd;

    for(var d = 0; d < availableDirections.length; d++){
      let visitedState = this.getVisitedForDirection(pos, availableDirections[d]);
      if(visitedState < bestVisitedState){
        nextDirection = availableDirections[d];
        bestVisitedState = visitedState;

      }

    }

    if(nextDirection){
      return nextDirection;
    }

    //normally, if the maze is solvable, there must be an visitedState < dead end.
  

    return null;
    
  }

  protected getVisitedForDirection(pos:[number, number], direction:Direction):Visited{
    let index:number = coordsToRoomNum(this.getPosFromDirection(pos, direction), this.breite);
    return this.visitedRooms[index][2];
  }

  protected getDirectionToLastRoom(pos:[number, number]):Direction{

    let roomNum = coordsToRoomNum(pos, this.breite);
    if(this.visitedRooms[roomNum] && this.visitedRooms[roomNum][1]){
      let lastRoomCoord = roomNumToCoords(this.visitedRooms[roomNum][1], this.breite);
      return this.getDirectionFromNeighbour(pos, lastRoomCoord);
    }else{
      return null;
    }
  }

  protected getDirectionFromNeighbour(pos:[number, number], newPos:[number, number]):Direction{

    if(pos[0] == newPos[0] && pos[1] == newPos[1]+1){
      return Direction.Right;
    }else if(pos[0] == newPos[0] && pos[1] == newPos[1]-1){
      return Direction.Left;
    }else if(pos[0] == newPos[0]-1 && pos[1] == newPos[1]){
      return Direction.Up;
    }else if(pos[0] == newPos[0]+1 && pos[1] == newPos[1]){
      return Direction.Down;
    }else{
      return null;
    }

  }

  protected getPosFromDirection(pos:[number, number], direction:Direction):[number, number]{
    switch(direction){
      case Direction.Up: {
        return [pos[0]-1, pos[1]];
      }

      case Direction.Down:{
        return [pos[0]+1, pos[1]];
      }

      case Direction.Left:{
        return [pos[0], pos[1]-1];
      }

      case Direction.Right:{
        return [pos[0], pos[1]+1];
      }
    }
  }

//TODO check direction correct order
  protected getAvailableDirections(neighbourRooms:Room[]):Direction[]{
    let availableDirections = [];

    if(neighbourRooms[0]){
      availableDirections.push(Direction.Up);
    }

    if(neighbourRooms[1]){
      availableDirections.push(Direction.Down);
    }

    if(neighbourRooms[2]){
      availableDirections.push(Direction.Left);
    }

    if(neighbourRooms[3]){
      availableDirections.push(Direction.Right);
    }
    return availableDirections;
  }

  protected getAvailableRoomCoords(pos:[number, number], neighbourRooms:Room[]):[number, number][]{
    let availableCoords = [];

    if(neighbourRooms[0]){
      availableCoords.push(this.getPosFromDirection(pos, Direction.Up));
    }

    if(neighbourRooms[1]){
      availableCoords.push(this.getPosFromDirection(pos, Direction.Down));
    }

    if(neighbourRooms[2]){
      availableCoords.push(this.getPosFromDirection(pos, Direction.Left));
    }

    if(neighbourRooms[3]){
      availableCoords.push(this.getPosFromDirection(pos, Direction.Right));
    }
    return availableCoords;
  }

    protected getAvailableRooms(neighbourRooms:Room[]):[number, number][]{
    let availableRooms = [];

    for(let i = 0; i < neighbourRooms.length; i++){
      if(neighbourRooms[i]){
        availableRooms.push(neighbourRooms[i]);
      }
    }
    return availableRooms;
  }
}
