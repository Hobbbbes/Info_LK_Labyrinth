import {Entity} from "./entity.js"

var w_array = [...Array(1+15).keys()].slice(5)

export class Weapon extends Entity{
  atk: number;
  w_array;
  constructor(atk: number){
    super(true)
    this.w_array = arr
    this.atk = 0
  }


  del(){
    super.entity_exists = false;

  }

  get_attributes(){
    return(this.atk);
  }
  generate_weapon() {
    this.atk = (this.w_array[Math.floor(Math.random() * this.w_array.length)])
    return (this.atk)
  }
}