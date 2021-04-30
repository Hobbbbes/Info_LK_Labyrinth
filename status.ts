
export class Status {
  
  room:[number, number]
  hp:number
  ap:number
  constructor(room:[number, number], hp:number, ap:number) {
    this.room = room
    this.hp = hp
    this.ap = ap
  }
  getRoom() {return this.room}
  getHP() {return this.hp}
  getAP() {return this.ap}
}