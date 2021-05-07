
export class Room {
  monster: number;
  sword: number; 
  isGoal: boolean; 
  constructor(monsterhp:number, weaponhp:number, goal:boolean){
    this.monster = monsterhp;
    this.sword = weaponhp;
		this.isGoal = goal;
  }
  getMonster(){return this.monster;}
  getSword(){return this.sword;}
  getIsGoal(){return this.isGoal;}
}





export const RoomIn = sword(monster(class RoomIn {
  monsterhp: number
	sword:number
  goal: boolean
  constructor(goal: boolean=false) {
    this.goal = goal
		this.sword = 0
    this.monsterhp = 0
  }
	getRoom() {
    let room = new Room(this.monsterhp, this.sword, this.goal)
    return room
  }
}))

export type RoomIn = InstanceType<typeof RoomIn>

function monster<T extends { new(...args: any[]): {} }>(constructor: T) {
	if (Math.round(Math.random()* 4) == 0) {
    return class extends constructor {
			monsterhp = Math.round(Math.random()*56 + 24)
    }
	}
}
function sword<T extends { new(...args: any[]): {} }>(constructor: T) {
	if (Math.round(Math.random()* 4) == 0) {
		return class extends constructor {
			sword = Math.round(Math.random()*50 + 25)
		}	
  }
}

let r= new RoomIn()
