import {GitterNetz as gi} from "./gitternetz.js"
import {isElem} from "./hilfsfunktionen.js"
import {status as s} from "./status.js"
import {room as r} from "./room.js"


enum Direction{
  Up,
  Down,
  Left,
  Right
}

export default class Spiel{
  agents:[number, number, number][] // [raumIndex, HP, attackDMG]
  current_agent:number

  constructor() {
    this.agents = []
    this.current_agent = -1
  }
  createAgent() {
    this.agents.push([g.coordsToRoomNum([g.start, 0])], 30, 1])
    this.current_agent ++
    return this.current_agent
  }
  
  neighbours(id:number) {
      let i = this.agents[id][0]
      let raumliste: (r.RoomOut | undefined)[] = [undefined, undefined, undefined, undefined]
      if ((isElem([i, i-g.breit, true], g.edges))) {raumliste[0] = g.rooms[i-g.breit].getRoom()}
      if ((isElem([i, i+1, true], g.edges))) {raumliste[1] = g.rooms[i+1].getRoom()}
      if ((isElem([i, i+g.breit, true], g.edges))) {raumliste[2] = g.rooms[i+g.breit].getRoom()}
      if ((isElem([i, i-1, true], g.edges))) {raumliste[3] = g.rooms[i-1].getRoom()}
      return raumliste
  }

  move(direction: Direction, id:number) {
    let player = this.agents[id]
    let i = this.agents[id][0]
    if (direction == Direction.Up) {
      if (this.neighbours(i)[0]) 
      {
       player[0] = i-g.breit 
       player[1] = player[1] - g.rooms[i-g.breit].monster.hp + g.rooms[i-g.breit].weapon.atk
    } 
      }
    if (direction == Direction.Right) {
      if (this.neighbours(i)[0]) {
       player[0] = i+1 
       player[1] = player[1] - g.rooms[i+1].monster.hp + g.rooms[i+1].weapon.atk
    } 
      }
    if (direction == Direction.Down) {
      if (this.neighbours(i)[0]) {
       player[0] = i+g.breit 
       player[1] = player[1] - g.rooms[i+g.breit].monster.hp + g.rooms[i+g.breit].weapon.atk
    } 
      }
    if (direction == Direction.Left) {
      if (this.neighbours(i)[0]) {
       player[0] = i-1 
       player[1] = player[1] - g.rooms[i-1].monster.hp + g.rooms[i-1].weapon.atk
      } 
    }
  }
  getStatus(id:number) {
    let player = this.agents[id]
    return s.Status(g.roomNumToCoords(player[0]), player[1], player[2])
  }
  deleteAgent(id:number) {
    this.agents[id] = undefined
  }
}
