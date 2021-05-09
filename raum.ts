export class Room {
  monster: number;
  
  public get Monster() : number {
    return this.monster;
  }
  
  sword: number;

  public get Sword() : number{
    return this.sword;
  }
  isGoal: boolean;
  constructor(monsterhp: number, weaponhp: number, goal: boolean) {
    this.monster = monsterhp;
    this.sword = weaponhp;
    this.isGoal = goal;
  }

}

export class RoomIn {
  monsterhp: number
  sword: number
  goal: boolean
  monsterprob:number
  swordprob:number
  constructor(monsterprob, swordprob, goal: boolean = false) {
    this.goal = goal
    if (Math.round(Math.random() * 99) < monsterprob) {
      this.monsterhp = Math.round(Math.random() * 56 + 24)
    } else {
      this.monsterhp = 0
    }
    if (Math.round(Math.random() * 99) < swordprob) {
      this.sword = Math.round(Math.random() * 50 + 25)
    } else {
      this.sword = 0
    }
  }
  getRoom() {
    let room = new Room(this.monsterhp, this.sword, this.goal)
    return room
  }
}