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
    this.ende = Math.round(Math.random() * (this.hoch - 1))
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

  show_draw(agentPos : [number,number], ctx : CanvasRenderingContext2D){
    ctx.lineWidth = 1
    let scale : number = 15;
    ctx.moveTo(0,0);
    ctx.lineTo(this.breit * scale,0);
    ctx.stroke();
    let draw_line = (xs:number, ys : number, xe : number, ye : number) => {
      ctx.moveTo(xs,ys);
      ctx.lineTo(xe,ye);
      ctx.stroke();
    }
    let draw_circle = (x : number, y : number, r : number)=>{
      ctx.beginPath();
      ctx.arc(x, y, r, 0, 2 * Math.PI,false);
      ctx.fill();
      ctx.stroke();
      ctx.closePath();
    }
    for (let i = 0; i < this.hoch * this.breit; i++) {
      let coords = this.roomNumToCoords(i);
      let y = coords[0]
      let x = coords[1]
      if (isElem([i, i + this.breit, false], this.edges) || i > (this.breit * (this.hoch - 1)) - 1) {
        draw_line(x*scale, (y+1)*scale,(x+1)*scale,(y+1)*scale);
      }
      if (isElem([i, i + 1, false], this.edges)) {
        draw_line((x+1)*scale, y*scale,(x+1)*scale,(y+1)*scale);
      }
      if(this.rooms[i][1].monsterhp > 0){
        ctx.fillStyle = "#0000FF";
        draw_circle(x*scale + scale/2, y*scale + scale/2, scale/4)
      } else if(this.rooms[i][1].sword > 0){
        ctx.fillStyle = "#FFFF00";
        draw_circle(x*scale + scale/2, y*scale + scale/2, scale/4)
      }
      if (this.rooms[i][1].monsterhp > 0 && this.rooms[i][1].sword > 0){
        ctx.fillStyle = "#00FF00";
        draw_circle(x*scale + scale/2, y*scale + scale/2, scale/4)
      }
      if((i + 1) % this.breit === 0){
        if (y !== this.start) {
          draw_line(0, y*scale,0,(y+1)*scale);
        }
        if (y !== this.ende) {
          draw_line(this.breit * scale, y*scale,this.breit * scale,(y+1)*scale);
        }
      }

    }
    ctx.fillStyle = "#FF0000";
    draw_circle(agentPos[1]*scale + scale/2, agentPos[0]*scale + scale/2, scale/2);

  }

  show(agentPos:number) {
    let strE: string = "|"
    let strS: string = " "
    let strB: string = "_"
    let row;
    
    if (0 == this.start) {
      row = " "
    } else {
      row = "|"
    }
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
        if (currentrow === this.start-1) {
          row = " "
        } else {
          row = "|"
        }
      }
    }
  }
}
