import {Entity} from "./entity.js"

// Library erstmal hierhin

var m_array = [...Array(1+20).keys()].slice(8)

export class Monster extends Entity{
  name: string;
  hp : number;
	m_array;
  constructor(hp: number){
    super(true);
    this.name = null;
    this.hp = hp
		this.m_array = m_array
  }


  get_name(){
    return(this.name);
  }

  del(){
    super.entity_exists = false
  }

  get_attributes(){
    return(this.hp);
  }

  generate_monster() {
    this.hp = (m_array[Math.floor(Math.random() * m_array.length)])
    return (this.hp)
  }
}

