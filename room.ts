import {Monster as m} from "./monster.js"
import {Weapon as w} from "./weapon.js"




export class RoomOut {
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

@m.generate_monster
@w.generate_weapon
export class Room {
  monster: m.Monster
  weapon: w.Weapon
  goal: boolean
  constructor(goal: boolean) {
    this.goal = goal
    if (Math.floor(Math.random()) * 101 > 70){
    this.monster = new m.Monster(m.generate_monster())
    }
    else {
      this.monster = new m.Monster(0)
    }
    if (Math.floor(Math.random()) * 101 > 60){
    this.weapon = new w.Weapon(w.generate_weapon())
    }
    else {
      this.weapon = new w.Weapon(0)
    }
    
  }
  
  getRoom() {
    let room = new RoomOut(this.monster.hp, this.weapon.atk, this.goal)
    return room
  }

}
