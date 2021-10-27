const fs = require('fs');

let dataSpend=JSON.parse(fs.readFileSync('./data/gastos.json',"utf8"));
let gastos=dataSpend.gastos;
let dataRM=JSON.parse(fs.readFileSync('./data/roommates.json',"utf8"));
let roomMate=dataRM.roommates;

gastos.forEach((e,i)=>{
    let targetList=e.distribution;
    //let montos=targetList.map((value)=>value);
    let sum=targetList.reduce((acc,cur)=>acc+cur);
    //console.log(montos);
    //console.log(targetList);
    //console.log("Gasto N°"+i+" es de: "+sum);
});

let arrNombres=roomMate.map((name)=>name.nombre);
console.log(arrNombres);

