export class Room {
  monster: number;
  sword: number;
  isGoal: boolean;
  constructor(monsterhp: number, weaponhp: number, goal: boolean) {
    this.monster = monsterhp;
    this.sword = weaponhp;
    this.isGoal = goal;
  }
  getMonster() { return this.monster; }
  getSword() { return this.sword; }
  getIsGoal() { return this.isGoal; }
}

export class RoomIn {
  monsterhp: number
  sword: number
  goal: boolean
  constructor(goal: boolean = false) {
    this.goal = goal
    if (Math.round(Math.random() * 4) == 0) {
      this.monsterhp = Math.round(Math.random() * 56 + 24)
    } else {
      this.monsterhp = 0
    }
    if (Math.round(Math.random() * 4) == 0) {
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