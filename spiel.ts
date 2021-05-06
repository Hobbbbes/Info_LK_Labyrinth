import {g} from "./gitternetz.js"
import {isElem} from "./hilfsfunktionen.js"
import {Status} from "./status.js"
import {Room, RoomOut} from "./room.js"


enum Direction{
  Up,
  Down,
  Left,
  Right
}

export default class Spiel{
  agents:[number, number, number][] // [[raumIndex, HP, attackDMG], ...]
  current_agent:number

  constructor() {
    this.agents = []
    this.current_agent = -1
  }
  createAgent() {
    this.agents.push([g.coordsToRoomNum([g.start, 0]), 30, 3])
    this.current_agent ++
    return this.current_agent
  }
  
  neighbours(id:number) {
      let i = this.agents[id][0]
      let raumliste: (RoomOut | undefined)[] = [undefined, undefined, undefined, undefined]
      if ((isElem([i, i-g.breit, true], g.edges))) {raumliste[0] = g.rooms[i-g.breit][1].getRoom()}
      if ((isElem([i, i+1, true], g.edges))) {raumliste[1] = g.rooms[i+1][1].getRoom()}
      if ((isElem([i, i+g.breit, true], g.edges))) {raumliste[2] = g.rooms[i+g.breit][1].getRoom()}
      if ((isElem([i, i-1, true], g.edges))) {raumliste[3] = g.rooms[i-1][1].getRoom()}
      return raumliste
  }

  move(direction: Direction, id:number) {
    let player = this.agents[id]
    let i = this.agents[id][0]

    if (player[1] > 0 && !g.rooms[i][1].goal) {
		let direction_to_check = -1
		let next_room = -1

    if (direction == Direction.Up) {
			let direction_to_check = 0;
			let next_room = i-g.breit;
    }
    else if (direction == Direction.Right) {
			let direction_to_check = 1;
			let next_room = i+1;
    }
    else if (direction == Direction.Down) {
			let direction_to_check = 2;
			let next_room = i+g.breit;
    }
    else if (direction == Direction.Left) {
			let direction_to_check = 3;
			let next_room = i-1;
    }
		
		if (this.neighbours(i)[direction_to_check]) {
      player[0] = next_room // Betritt nächsten Raum
    	player[2] = player[2] + g.rooms[next_room][1].sword // Sammelt Schwert auf
			g.rooms[next_room][1].sword = 0
			
      if (player[2] >= g.rooms[next_room][1].monsterhp) {
        g.rooms[next_room][1].monsterhp = 0
      }
      else {
        g.rooms[next_room][1].monsterhp = g.rooms[next_room][1].monsterhp - player[2]
      }

			player[2] -= g.rooms[next_room][1].monsterhp  // wird vom monster geboxt
			
			
      if (player[2] < 0) {
        player[1] = player[1] + player[2] 
        player[2] = 3
      }

      
    }
    }
  }
  getStatus(id:number) {
    let player = this.agents[id]
    let isFinish = false
    if (player[0] === (g.breit*g.ende) - 1) {
      isFinish = true
    }
    return new Status(g.roomNumToCoords(player[0]), player[1], player[2], isFinish)
  }
  deleteAgent(id:number) {
    this.agents[id] = undefined
  }
}
