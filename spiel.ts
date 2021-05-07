import {isElem} from "./hilfsfunktionen.js"
import {Status} from "./status.js"
import {RoomIn, Room} from "./raum.js"
import {GitterNetz} from "./gitternetz.js"


enum Direction{
  Up,
  Down,
  Left,
  Right
}

export default class Spiel{
  private agents:[number, number, number][]; // [[raumIndex, HP, attackDMG], ...]
  private current_agent:number;
  private g: GitterNetz;

  constructor(hoch, breit) {
    this.agents = []
    this.current_agent = -1
    this.g = new GitterNetz(hoch, breit)
  }
  createAgent():number {
    this.agents.push([this.g.coordsToRoomNum([this.g.start, 0]), 30, 3])
    this.current_agent ++
    return this.current_agent
  }
  
  neighbours(id:number):(Room | undefined)[] {
      let i = this.agents[id][0]
      let raumliste: (Room | undefined)[] = [undefined, undefined, undefined, undefined]
      if ((isElem([i, i-this.g.breit, true], this.g.edges))) {raumliste[0] = this.g.rooms[i-this.g.breit][1].getRoom()}
      if ((isElem([i, i+1, true], this.g.edges))) {raumliste[1] = this.g.rooms[i+1][1].getRoom()}
      if ((isElem([i, i+this.g.breit, true], this.g.edges))) {raumliste[2] = this.g.rooms[i+this.g.breit][1].getRoom()}
      if ((isElem([i, i-1, true], this.g.edges))) {raumliste[3] = this.g.rooms[i-1][1].getRoom()}
      return raumliste
  }

  move(direction: Direction, id:number):void {
    let player = this.agents[id]
    let i = this.agents[id][0]

    if (player[1] > 0 && !this.g.rooms[i][1].goal) {
		let direction_to_check = -1
		let next_room = -1

        if (direction == Direction.Up) {
                let direction_to_check = 0;
                let next_room = i-this.g.breit;
        }
        else if (direction == Direction.Right) {
                let direction_to_check = 1;
                let next_room = i+1;
        }
        else if (direction == Direction.Down) {
                let direction_to_check = 2;
                let next_room = i+this.g.breit;
        }
        else if (direction == Direction.Left) {
                let direction_to_check = 3;
                let next_room = i-1;
        }
            
        if (this.neighbours(i)[direction_to_check]) {
            player[0] = next_room // Betritt nächsten Raum
            player[2] = player[2] + this.g.rooms[next_room][1].sword // Sammelt Schwert auf
            this.g.rooms[next_room][1].sword = 0
                    
            if (player[2] >= this.g.rooms[next_room][1].monsterhp) {
		player[2] -= this.g.rooms[next_room][1].monsterhp
                this.g.rooms[next_room][1].monsterhp = 0
            }
            else {
                this.g.rooms[next_room][1].monsterhp = this.g.rooms[next_room][1].monsterhp - player[2]
            }
            player[2] -= this.g.rooms[next_room][1].monsterhp  // wird vom monster geboxt
            if (player[2] < 0) {
                player[1] = player[1] + player[2] 
                player[2] = 3
                }  
            }
        }
    }

  getStatus(id:number):Status {
    let player = this.agents[id]
    let isFinish = false
    if (player[0] === (this.g.breit*this.g.ende) - 1) {
        isFinish = true
    }
    return new Status(this.g.roomNumToCoords(player[0]), player[1], player[2], isFinish)
    }
}
