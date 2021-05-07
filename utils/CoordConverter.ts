
export let roomNumToCoords = function(i:number, breit:number):[number, number] {
    return [(Math.floor(i/(breit))), i%(breit)]
}

export let coordsToRoomNum = function ([x,y]:[number,number], breit:number) {
      return breit*y+x
}
