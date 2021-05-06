"use strict";
exports.__esModule = true;
var CoordConverter_1 = require("../utils/CoordConverter");
var a = [1, 4, 76, 9];
var b = a;
a[1] = 5;
console.log(b);
console.log(CoordConverter_1.roomNumToCoords(12, 5));
console.log(a[-1]);
console.log(5 + 1 % 3);
let i = 1;
console.log(i++);
console.log(i);
let c = 2;
let d = undefined;
if(c){
  console.log("asd");
}
if(d){
  console.log("fdstg");
}