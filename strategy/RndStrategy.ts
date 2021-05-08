
import {Strategy} from "./Strategy"
import {Room} from ?;
import {Direction} from "./Strategy";

export class RndStrategy extends Strategy{

    protected filterDirections(pos:[number, number], neighbourRooms:Room[], availableDirections:Direction[], hp:number, ap:number):Direction[]{
      return availableDirections
    }

    protected orderByPreferences(pos:[number, number], availableDirections:Direction[], hp:number, ap:number):Direction[]{
      let directions:Direction[] = [];

      while(availableDirections.length > 0){
        let rndIndex = Math.round(Math.random()*(availableDirections.length-1));
        directions.push(availableDirections[rndIndex]);
        availableDirections.splice(rndIndex, 1);
      }
      
      return directions;
    }
} 

// verschiedene Möglichkeiten der Implementationen der Strategien
// 24 Möglichkeiten eine bestimmte Reihenfolge vorzugeben [rechts, links, oben, unten]
// Als andere Alternative könnte man die Reihenfolge immer random wählen, dass heißt es ist nichts vorgegeben
// Dann kann man noch eine Strategie implementieren in der man immer als Erstwunsch die Tür vom Vorgänger wählt, das heißt wenn man im vorigen Zug sich nach rechts bewegt hat ist die erste Tür die man jetzt probiert zu wählen auch die rechte
// Es besteht noch die Möglichkeit, in Richtung KI etwas zu implementieren 
// Man probiert also zu schauen ob ein Monster in nächstem Raum vorhanden ist, wenn einer vorhanden ist probiert man diesen Weg zu vermeiden bzw. wählt erst diesen Weg wenn man ein genügend starkes Schwert hat
// eine weitere Strategie wäre dann dementsprechend immer Räume zuerst zu wählen indenen Monster drin sind
