export function shuffle(array:any[]) {
  let currentIndex = array.length, temporaryValue, randomIndex
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex --
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }

  return array;
}
  
export function isElem(el:[number,number,boolean], arr:[number,number,boolean][]) {
    for (var i of arr) {
        if ((el[0] === i[0]) && (el[1] === i[1]) && (el[2]===i[2])) {
            return true
        }
    }
    return false
}
  
export function isElem1(el:number, arr:number[]) {
    for (var i of arr) {
        if (i===el) {
            return true
        }
    }
    return false
}