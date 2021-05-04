

export class Status {
  
  room:[number, number]
  hp:number
  ap:number
  finish:boolean
  constructor(room:[number, number], hp:number, ap:number, finish: boolean) {
    this.room = room
    this.hp = hp
    this.ap = ap
    this.finish = finish
  }
  getRoom() {return this.room}
  getHP() {return this.hp}
  getAP() {return this.ap}
  haveIFinished() {return this.finish} // fragwürdiger Methodenname
}