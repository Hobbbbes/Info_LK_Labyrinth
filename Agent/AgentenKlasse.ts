import {Strategy, Direction, Visited} from "../strategy/Strategy.js";
import {Room} from "../raum.js"
import {Status} from "../status.js"
import Spiel from "../spiel.js"
export class Agent {

    private breite : number; // des labyrints
    private hohe : number;
    
    private status: Status;

    private id: number; 

    private g: Spiel;

    private visited: Array<[Room, number, Visited]>;

    private s: Strategy;

    constructor(id:number, breite: number, hohe: number, g: Spiel, s: Strategy ){
      this.breite = breite;
      this.hohe = hohe;
      let n = breite * hohe;
      this.visited = new Array(n); //der laenge n
      this.g = g;
      this.id = id;
      this.s = s;
    }

    /*public getaktuell(): number
    {
        return this.status; 
    }*/

   private checkAllVisited(): boolean{
     for (let i = 0; i < this.visited.length; i ++)
      if (this.visited[i] == undefined || this.visited[i][2] != Visited.Visited_DeadEnd) //pruefen
        return false;
     return true;
   }


    step() : boolean
    {
      this.status = this.g.getStatus(this.id);

      if(this.status.hp > 0 && !this.checkAllVisited() && !this.status.finish){
        //Abbruchbedingungen tod, ausgang erreicht, all visited
        let neighbours = this.g.neighbours(this.id); // get neighbours from laby

        let direction = this.s.getNextRoom(this.status.Pos, neighbours, this.status.HP, this.status.SwordStrenght);

        if(direction != null){
            this.g.move(direction, this.id);
            return true;
        }
      }

    return false

    }

/*
            var nextroomkoord1 : number = status.pos[0];
            var nextroomkoord2 : number = status.pos[1];

            if(direction == Direction.Up) {
                nextroomkoord2 ++;
            }
            if(direction == Direction.Down) {
                nextroomkoord2 --;
            }
            if(direction == Direction.Right) {
                nextroomkoord1 ++;
            }
            if(direction == Direction.Left) {
                nextroomkoord1 --;
            }
*/
            //this.visited[coordsToRoomNum([nextroomkoord1, nextroomkoord2], this.breite)] = coordsToRoomNum(this.status.pos, this.breite);

} /*abstract strategy(): number;*/