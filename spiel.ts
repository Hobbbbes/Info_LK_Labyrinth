import { isElem } from "./hilfsfunktionen.js"
import { Status } from "./status.js"
import { RoomIn, Room } from "./raum.js"
import { GitterNetz } from "./gitternetz.js"
import { Direction} from "./strategy/Strategy.js"
import { coordsToRoomNum, roomNumToCoords } from "./utils/CoordConverter.js"

export default class Spiel {
  private agents: [number, number, number][]; // [[raumIndex, HP, attackDMG], ...]
  private current_agent: number;
  private g: GitterNetz;
  private monster:number
  private sword:number

  constructor(hoch, breit, monster:number = 20, sword = 20) {
    this.agents = []
    this.current_agent = -1
    this.g = GitterNetz.generateGitternetz(hoch, breit, monster, sword)
    this.g.show(-1);
  }
  createAgent(): number {
    this.agents.push([coordsToRoomNum([this.g.start+1, 0], this.g.breit), 30, 3])
    this.current_agent++
    return this.current_agent
  }

  neighbours(id: number): (Room | undefined)[] {
    let i = this.agents[id][0]
    let raumliste: (Room | undefined)[] = [undefined, undefined, undefined, undefined]
    if ((isElem([i - this.g.breit,i, true], this.g.edges))) { raumliste[0] = this.g.rooms[i - this.g.breit][1].getRoom() }
    if ((isElem([i, i + 1, true], this.g.edges))) { raumliste[1] = this.g.rooms[i + 1][1].getRoom() }
    if ((isElem([i, i + this.g.breit, true], this.g.edges))) { raumliste[2] = this.g.rooms[i + this.g.breit][1].getRoom() }
    if ((isElem([i - 1, i, true], this.g.edges))) { raumliste[3] = this.g.rooms[i - 1][1].getRoom() }
    return raumliste
  }

  move(direction: Direction, id: number): void {
    let player = this.agents[id]
    let i = this.agents[id][0]

    if (player[1] > 0 && !this.g.rooms[i][1].goal) {
      let direction_to_check = -1
      let next_room = -1

      if (direction == Direction.Up) {
        direction_to_check = 0;
        next_room = i - this.g.breit;
      }
      else if (direction == Direction.Right) {
        direction_to_check = 1;
        next_room = i + 1;
      }
      else if (direction == Direction.Down) {
        direction_to_check = 2;
        next_room = i + this.g.breit;
      }
      else if (direction == Direction.Left) {
        direction_to_check = 3;
        next_room = i - 1;
      }
      if (this.neighbours(id)[direction_to_check] != null) {
        player[0] = next_room // Betritt nächsten Raum
        player[2] = player[2] + this.g.rooms[next_room][1].sword // Sammelt Schwert auf
        this.g.rooms[next_room][1].sword = 0

        if (player[2] >= this.g.rooms[next_room][1].monsterhp) {
          player[2] -= this.g.rooms[next_room][1].monsterhp
          this.g.rooms[next_room][1].monsterhp = 0
        }
        else {
          this.g.rooms[next_room][1].monsterhp = this.g.rooms[next_room][1].monsterhp - player[2]
          player[2] = 3
        }
        player[1] -= this.g.rooms[next_room][1].monsterhp  // wird vom monster geboxt 
      }
    }else{
      console.log(i);
      console.log(this.g.rooms[i][1].goal);
    }
  }

  getStatus(id: number): Status {
    let player = this.agents[id]
    let isFinish = false
    if (player[0] == coordsToRoomNum([this.g.ende, this.g.breit-1], this.g.breit)) {
      isFinish = true
    }
    return new Status(roomNumToCoords(player[0], this.g.breit), player[1], player[2], isFinish)
  }

  show(){
    this.g.show(this.agents[this.current_agent][0]);
  }
}