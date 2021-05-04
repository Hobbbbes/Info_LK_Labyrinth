import {Monster} from "./monster.js"
import {Weapon} from "./weapon.js"




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

@Monster.generate_monster
@Weapon.generate_weapon


export class Room {
  monster: Monster
  weapon: Weapon
  goal: boolean
  constructor(goal: boolean=false) {
    this.goal = goal
    if (Math.floor(Math.random()) * 101 > 70){
    this.monster = new Monster(0)
    this.monster.generate_monster()
    }
    else {
      this.monster = new Monster(0)
    }
    if (Math.floor(Math.random()) * 101 > 60){
    this.weapon = new Weapon(0)
    this.weapon
    }
    else {
      this.weapon = new Weapon(0)
    }
    
  }
  
  getRoom() {
    let room = new RoomOut(this.monster.hp, this.weapon.atk, this.goal)
    return room
  }

}
