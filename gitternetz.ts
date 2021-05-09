import { isElem, isElem1, shuffle } from "./hilfsfunktionen.js"
import { RoomIn } from "./raum.js"
import { coordsToRoomNum } from "./utils/CoordConverter.js";


export class GitterNetz {
  private static gitter: GitterNetz;
  hoch: number;
  breit: number;
  sword:number
  monster:number
  rooms: Array<[number, RoomIn]>;
  edges: Array<[number, number, boolean]>;
  ende: number
  start: number
  private constructor(hoch: number, breit: number, monster, sword) {
    this.hoch = hoch;
    this.breit = breit;
    this.rooms = [];
    this.start = Math.round(Math.random() * (this.hoch - 1))
    this.ende = Math.round(Math.random() * this.hoch - 1)
    for (let i = 0; i < this.breit * this.hoch; i++) {
      let broom = new RoomIn(monster, sword);
      if (i == this.coordsToRoomNum([this.ende, this.breit-1])) {
        broom.goal = true;
      }
      this.rooms.push([i, broom]);
    }
    this.edges = [];
    for (let i = 0; i < (this.hoch * this.breit); i++) {
      if ((!((i % this.breit) + 1 === this.breit)) && (!(isElem([i, i + 1, false], this.edges)))) {
        this.edges.push([i, i + 1, false])
      }
      if ((!(i > (this.breit * (this.hoch - 1) - 1))) && (!(isElem([i, i + this.breit, false], this.edges)))) {
        this.edges.push([i, i + this.breit, false])
      }
    }
    this.dfs(5)
  }

  public static generateGitternetz(hoch, breit, monster, sword): GitterNetz {
    if (!GitterNetz.gitter) {
      GitterNetz.gitter = new GitterNetz(hoch, breit, monster, sword)
    }
    return GitterNetz.gitter
  }
  roomOfIndex(i: number) {
    for (var ecke of this.rooms) {
      if (ecke[0] === i) { return ecke[1] }
    }
  }
  roomNumToCoords(i: number): [number, number] {
    return [(Math.floor(i / (this.breit))), i % (this.breit)]
  }
  coordsToRoomNum([x, y]: [number, number]) {
    return this.breit * x + y
  }
  findneighbours(i: number) {
    let raumliste: number[] = []
    if (!(i <= this.breit)) { raumliste.push(this.rooms[(i - this.breit)][0]) }
    if (!(i % this.breit === 0)) { raumliste.push(this.rooms[(i - 1)][0]) }
    if (!(i % this.breit === this.breit - 1)) { raumliste.push(this.rooms[(i + 1)][0]) }
    if (!(i >= (this.hoch - 1) * this.breit)) { raumliste.push(this.rooms[(i + this.breit)][0]) }
    return raumliste
  }
  dfs(probability: number = 5, start: number = 0, way: number[] = [0]) {
    let next: number[] = shuffle(this.findneighbours(start))
    for (let room of next) {
      let in_way = isElem1(room, way)
      let chance = Math.random() * 100 <= probability;
      if (!in_way || chance) {
        this.edges.forEach(function (value) { if ((value[0] === start && value[1] === room) || (value[1] === start && value[0] === room)) { value[2] = true } })
        if (!in_way) {
          way.push(room)
          this.dfs(probability, room, way);
        }
      }
    }
  }
  show(agentPos:number) {
    let strE: string = "|"
    let strS: string = " "
    let strB: string = "_"
    let row = strE
    let str = ""
    let swall = "S̲"
    let s = "S"
    let mwall = "M̲"
    let m = "M"
    let bwall = "B̲"
    let b = "B"
    let awall = "̲A"
    let a = "A"
    for (let i = 0; i < this.breit; i++) {
      str = str.concat(strS.toString())
      str = str.concat(strB.toString())
    }
    console.log(str)
    strS = " "
    for (let i = 0; i < this.hoch * this.breit; i++) {
      let currentrow = Math.floor(i / this.breit)
      if (isElem([i, i + this.breit, false], this.edges) || i > (this.breit * (this.hoch - 1)) - 1) {
        if (i == agentPos) {row = row.concat(awall.toString())}
        else if (this.rooms[i][1].monsterhp > 0 && this.rooms[i][1].sword > 0) {row = row.concat(bwall.toString())}
        else if (this.rooms[i][1].sword > 0) {row = row.concat(swall.toString())}
        else if (this.rooms[i][1].monsterhp > 0) {row = row.concat(mwall.toString())}
        else { row = row.concat(strB.toString()) }
      } else {
        if (i == agentPos) {row = row.concat(a.toString())}
        else if (this.rooms[i][1].monsterhp > 0 && this.rooms[i][1].sword > 0) {row = row.concat(b.toString())}
        else if (this.rooms[i][1].sword > 0) {row = row.concat(s.toString())}
        else if (this.rooms[i][1].monsterhp > 0) {row = row.concat(m.toString())}
        else { row = row.concat(strS.toString()) }
      }
      if (isElem([i, i + 1, false], this.edges)) {
        row = row.concat(strE.toString())
      } else {
        row = row.concat(strS.toString())
      }
      if ((i + 1) % this.breit === 0) {
        row = row.substring(0, row.length - 1)
        if (!(currentrow === this.ende)) {
          row = row.concat(strE.toString())
        }
        console.log(row)
        if (currentrow === this.start) {
          row = " "
        } else {
          row = "|"
        }
      }
    }
  }
}
let g = GitterNetz.generateGitternetz(10,10,10,10)
console.log(g.roomNumToCoords(0))
console.log(g.roomNumToCoords(20))
console.log(g.coordsToRoomNum([2, 0]))