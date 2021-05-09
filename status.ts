

export class Status {
  
  room:[number, number]
  
  public get Pos() : [number,number] {
    return this.room;
  }
  
  hp:number
  public get HP() : number {
    return this.hp;
  }
  ap:number
  public get SwordStrenght() : number {
    return this.ap;
  }
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