import {roomNumToCoords, coordsToRoomNum} from "../utils/CoordConverter";

let a = [1, 4, 76, 9];
let b = a;
a[1] = 5;
console.log(b);
console.log(roomNumToCoords(12, 5));

console.log(a[2]);
