import {Room} from "../raum.js";
import {roomNumToCoords, coordsToRoomNum} from "../utils/CoordConverter.js";

export enum Direction{
    Up = 0,
    Right = 1,
    Down = 2,
    Left = 3
};

export enum Visited{
    Unvisited = 0,
    Visited_unvisited = 1, //path has an empty unvisited neighbourRoom
    Monster = 2, //path has an unvisited neighbourRoom with a monster
    Monster_invincible = 3, //path has an unvisited neighbourRoom with a monster
    Visited_DeadEnd = 4 //path has no unvisited neighbourRooms
}

export abstract class Strategy{
    protected breite:number;
    public visitedRooms:[Room, number, Visited][];
  
    constructor(breite:number){
        this.breite = breite;
    }

    public setVisitedRooms(visitedRooms:[Room, number, number][]){
        this.visitedRooms = visitedRooms;
    }

    protected abstract orderByPreferences(pos:[number, number], availableDirections:Direction[], hp:number, ap:number):Direction[];

    public getNextRoom(pos:[number, number], neighbourRooms:Room[], hp:number, ap:number):Direction{
        //console.log("asdas")
        //console.log(pos)
        //console.log(coordsToRoomNum(pos, this.breite));
        //console.log(neighbourRooms);


        //um exceptions zu verhindern und trotzdem damit arbeiten zu können, füge ich die umliegenden Räume in die visited-Liste ein. 
        // Der Startraum wird, falls man in ihm ist, ebenfalls hinzugefügt und nach der ersten Bewegung verlinkt, um Loop, die durch den Startknoten gehen zu erkennen  
        this.registerRooms(pos, neighbourRooms, this.getRoomNums(pos, neighbourRooms));

        //suche alle Nachbarräume die
        //  - nicht null sind
        //  - nicht zu einem Loop führen
        let availableRoomsCoordsAndDirections = this.getAvailableRoomsRoomNumsAndDirections(pos, neighbourRooms);
        let availableRooms = availableRoomsCoordsAndDirections[0];
        let availableRoomNums = availableRoomsCoordsAndDirections[1];
        let availableDirections = availableRoomsCoordsAndDirections[2];
        console.log(availableDirections);
        
        //nun lasse ich mir die liste der availableRooms anhand bestimmter Präferenzen sortieren, die von der Strategie abhängig sind. Falls Räume erst später besucht werden 
        //sollen, kann man sie aus der Liste streichen und den Raum mit dem entsprechenden VisitedStatus markieren
        let sortedDirections = this.orderByPreferences(pos, Object.assign([], availableDirections), hp, ap);
        //console.log(sortedDirections);
        
        //als nächstes wird eine Direction ausgewählt. Bevorzugt werden nicht besichtigte Räume in der Reihenfolge, wie sie von der Strategie sortiert werden. 
        // Wenn aber alle zurückgegebenen Directions schon besichtigt wurden, wird die ausgewählt, die den kleinsten Visited-Status hat.
        let nextDirection = this.getNextDirection(pos, sortedDirections);
        
        //finde das geringste VisitedState aus den Nachbarräumen, die nicht zu einem Loop führen und die nicht dem Raum entsprechen, in den man als nächstes geht 
        this.calculateAndSetVisitedState(pos, availableRoomNums, nextDirection);
        
        // wenn wir den neuen Raum zum ersten mal betreten, setzte sein lastroom auf den alten
        this.setLastRoom(pos, nextDirection);
        
        console.log("nextDirection: " + nextDirection)

        return nextDirection;
    }

    private setLastRoom(pos:[number, number], nextDirection:Direction){
        let lastRoomNum = coordsToRoomNum(pos, this.breite);
        let newRoomNum = this.getRoomNumFromDirection(pos, nextDirection);

        if(this.visitedRooms[newRoomNum][1] == null){
            this.visitedRooms[newRoomNum][1] = lastRoomNum;
        }
    }

    private calculateAndSetVisitedState(pos, availableRoomNums:number[], nextDirection:Direction){
        let visitedState:Visited = Visited.Visited_DeadEnd;
        let nextRoomNum = this.getRoomNumFromDirection(pos, nextDirection);

        for(let neighbourRoomNum of availableRoomNums){
            if(neighbourRoomNum != nextRoomNum){ //der Raum, in dem man geht wird nicht mit einbezogen
                let neighbourVisitedState = Math.max(this.visitedRooms[neighbourRoomNum][2], Visited.Visited_unvisited);
                visitedState = Math.min(neighbourVisitedState, visitedState);
            }
        }

        this.visitedRooms[coordsToRoomNum(pos, this.breite)][2] = visitedState;
    }

    private getNextDirection(pos:[number, number], sortedDirections:Direction[]){

        //suche den Nachbarraum, mit dem geringsten Visited. Falls es mehrere gibt, nehme den ersten
        let nextDirection = -1;
        let bestVisitedState = Visited.Visited_DeadEnd;
    
        for(let direction of sortedDirections){

            let visitedState = this.getVisitedForDirection(pos, direction);
            if(visitedState < bestVisitedState){
                nextDirection = direction;
                bestVisitedState = visitedState;
            }
        }

        if (nextDirection >= 0) {
            return nextDirection;
        }

        //console.log(this.visitedRooms);
        //console.log(sortedDirections);
        //console.log(pos);
        throw new Error("Das Labyrinth ist nicht Lösbar");
    }

    private registerRooms(pos:[number, number], neighbourRooms:Room[], neighbourRoomNums:number[]){
        let roomNum = coordsToRoomNum(pos, this.breite);

        //wenn man am Startraum ist, initialisiere ihn mit
        if(this.visitedRooms[roomNum] == null){
          this.visitedRooms[roomNum] = [null, null, Visited.Unvisited];
        }
    
        for(let i = 0; i < neighbourRooms.length; i++){
            if(neighbourRooms[i] == null){
                continue;
            }
            let nextRoom = neighbourRooms[i];
            let nextRoomNum = neighbourRoomNums[i];

            if(this.visitedRooms[nextRoomNum] == null){//wenn der Nachbarraum zum 1. mal auftaucht
                this.visitedRooms[nextRoomNum] = [nextRoom, null, Visited.Unvisited];
            }else if(this.visitedRooms[nextRoomNum][0] == null){//wenn der Startraum zum 1. mal als Nachbar auftaucht
                this.visitedRooms[nextRoomNum][0] = nextRoom; // füge den Startraum in die liste ein
                this.visitedRooms[nextRoomNum][1] = roomNum;
            }else{//aus irgendeinem Grund ändern sich bei mir die Werte für Monster und Schwert nicht. muss deshalb immer aktualisieren
                this.visitedRooms[nextRoomNum][0] = nextRoom;
            }
        }

    }

    private getAvailableRoomsRoomNumsAndDirections(pos:[number, number], rooms:Room[]):[Room[], number[], Direction[]]{
        let availableRooms = [];
        let availableRoomNums = [];
        let availableDirections = [];
    
        if(rooms[0] != null && this.checkForLoopFromCoords(pos, this.getCoordsFromDirection(pos, Direction.Up))){
            availableRooms.push(rooms[0]);
            availableRoomNums.push(this.getRoomNumFromDirection(pos, Direction.Up));
            availableDirections.push(Direction.Up);
        }
    
        if(rooms[1] != null&& this.checkForLoopFromCoords(pos, this.getCoordsFromDirection(pos, Direction.Right))){
            availableRooms.push(rooms[1]);
            availableRoomNums.push(this.getRoomNumFromDirection(pos, Direction.Right));
            availableDirections.push(Direction.Right);
        }
    
        if(rooms[2] != null && this.checkForLoopFromCoords(pos, this.getCoordsFromDirection(pos, Direction.Down))){
            availableRooms.push(rooms[2]);
            availableRoomNums.push(this.getRoomNumFromDirection(pos, Direction.Down));
            availableDirections.push(Direction.Down);
        }
    
        if(rooms[3] != null && this.checkForLoopFromCoords(pos, this.getCoordsFromDirection(pos, Direction.Left))){
            availableRooms.push(rooms[3]);
            availableRoomNums.push(this.getRoomNumFromDirection(pos, Direction.Left));
            availableDirections.push(Direction.Left);
        }
        return [availableRooms, availableRoomNums, availableDirections];
    }

    private getRoomNums(pos:[number, number], rooms:Room[]):number[]{
        let roomNums = [];
    
        if(rooms[0] != null){
            roomNums.push(this.getRoomNumFromDirection(pos, Direction.Up));
        }else{
          roomNums.push(null);
        }
    
        if(rooms[1] != null){
          roomNums.push(this.getRoomNumFromDirection(pos, Direction.Right));
        }else{
          roomNums.push(null);
        }
    
        if(rooms[2] != null){
            roomNums.push(this.getRoomNumFromDirection(pos, Direction.Down));
        }else{
          roomNums.push(null);
        }
    
        if(rooms[3] != null){
            roomNums.push(this.getRoomNumFromDirection(pos, Direction.Left));
        }else{
          roomNums.push(null);
        }
        return roomNums;
    }


    protected getVisitedForDirection(pos:[number, number], direction:Direction):Visited{
        let index:number = coordsToRoomNum(this.getCoordsFromDirection(pos, direction), this.breite);
        return this.visitedRooms[index][2];
    }

    protected getDirectionToRoomBeforeFromCoords(pos:[number, number]):Direction{
        return this.getDirectionToRoomBeforeFromRoomNum(coordsToRoomNum(pos, this.breite));
    }

    protected getDirectionToRoomBeforeFromRoomNum(roomNum:number):Direction{
        let roomNumBefore = this.getRoomNumBeforeFromRoomNum(roomNum);
        if(roomNumBefore != null)
            return this.getDirectionFromRoomNum(roomNum, roomNumBefore);
        else
            return null;
    }

    protected getRoomBeforeInformationsFromCoords(pos:[number, number]){
        this.getRoomBeforeInformationsFromRoomNum(coordsToRoomNum(pos, this.breite));
    }

    protected getRoomBeforeInformationsFromRoomNum(roomNum:number){
        let roomNumBefore = this.getRoomNumBeforeFromRoomNum(roomNum);
        if(roomNumBefore != null)
            this.visitedRooms[roomNumBefore];
        else
            return null;
    }
    
    protected getRoomNumBeforeFromCoords(pos:[number, number]):number{
        return this.getRoomNumBeforeFromRoomNum(coordsToRoomNum(pos, this.breite));
    }

    protected getRoomNumBeforeFromRoomNum(roomNum:number):number{
        if(this.visitedRooms[roomNum] != null){
            return this.visitedRooms[roomNum][1];
        }else{
            return null;
        }
    }

    protected getRoomInformationsFromDirection(pos:[number, number], direction:Direction):[Room, number, Visited]{
        return this.getRoomInformationsFromCoords(this.getCoordsFromDirection(pos, direction));
    }
    
    protected getRoomInformationsFromCoords(pos:[number, number]):[Room, number, Visited]{
        return this.getRoomInformationsFromRoomNum(coordsToRoomNum(pos, this.breite));
    }

    protected getRoomInformationsFromRoomNum(roomNum:number):[Room, number, Visited]{
        return this.visitedRooms[roomNum];
    }

    protected getRoomFromDirection(pos:[number, number], direction):Room{
        return this.visitedRooms[this.getRoomNumFromDirection(pos, direction)][0];
    }

    protected getRoomNumFromDirection(pos:[number, number], direction:Direction):number{
        return coordsToRoomNum(this.getCoordsFromDirection(pos, direction), this.breite);
    }

    protected getCoordsFromDirection(pos:[number, number], direction:Direction):[number, number]{
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

    protected getDirectionFromRoomNum(roomNum1:number, roomNum2:number):Direction{
        let a = this.getDirectionFromCoords(roomNumToCoords(roomNum1, this.breite), roomNumToCoords(roomNum2, this.breite));
        //console.log(a);
        return a;
    }

    protected getDirectionFromCoords(pos1:[number, number], pos2:[number, number]):Direction{
        //console.log(pos1 + "   pos2:" + pos2);
        if(pos1[0] == pos2[0] && pos1[1]+1 == pos2[1]){
                return Direction.Right;
            }else if(pos1[0] == pos2[0] && pos1[1]-1 == pos2[1]){
                return Direction.Left;
            }else if(pos1[0]-1 == pos2[0] && pos1[1] == pos2[1]){
                return Direction.Up;
            }else if(pos1[0]+1 == pos2[0] && pos1[1] == pos2[1]){
                return Direction.Down;
            }else{
                return null;
        }
    }

    protected checkForLoopFromCoords(pos1:[number, number], pos2:[number, number]):boolean{
        return this.checkForLoopFromRoomNum(coordsToRoomNum(pos1, this.breite), coordsToRoomNum(pos2, this.breite));
    }

    protected checkForLoopFromRoomNum(roomNum1:number, roomNum2:number):boolean{
        if(this.visitedRooms[roomNum2][1] == null
            || this.visitedRooms[roomNum2][1] == roomNum1
            || this.visitedRooms[roomNum1][1] == roomNum2){
                return true;
            }else{
                return false;
            }
    }
}