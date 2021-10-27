/* [1.] Ocupar el módulo File System para la manipulación de archivos alojados en el
servidor */
const fs = require('fs');
const { v4: uuidv4 } = require("uuid");


let newSpend=async(spend)=>{
    let dataSpend;
    fs.readFile('./data/gastos.json',"utf8",(err,data)=>{
        if(err){
            console.log(err)
        }else{
            try {
                let objRM = JSON.parse(fs.readFileSync('./data/roommates.json','utf8'));
                let arrRM = objRM.roommates;
                dataSpend = JSON.parse(data);
                let spendList=dataSpend.gastos;
                let newSpend = {
                    id:uuidv4().slice(30),
                    roommate:spend.roommate,
                    descripcion:spend.descripcion,
                    monto:spend.monto,
                    distribution:[],
                }
                spendList.push(newSpend);
                let gastosList=spendList[spendList.length-1].distribution;
                let indValue= (newSpend.monto/(arrRM.length));
                arrRM.forEach((e)=>{
                    gastosList.push(indValue)
                    if(e.nombre==newSpend.roommate){
                        e.recibe+=indValue;
                    }else{
                        e.debe-=indValue;
                    }
                })
                //console.log(gastosList);
                let contenido = JSON.stringify(dataSpend);
                fs.writeFileSync("./data/gastos.json", contenido);
                let contentRM = JSON.stringify(objRM);
                fs.writeFileSync("./data/roommates.json", contentRM);
                //console.log(dataSpend);
            } catch (error) {console.log(error);}
        }
    });
};

let updateSpend=async(spend, id)=>{
    let dataSpend;
    fs.readFile('./data/gastos.json',"utf8",(err,data)=>{
        if(err){
            console.log(err)
        }else{
            try {
                let lastValue;
                let objRM = JSON.parse(fs.readFileSync('./data/roommates.json','utf8'));
                let arrRM = objRM.roommates;
                let arrNombres=arrRM.map((name)=>name.nombre);
                console.log(arrNombres);
                dataSpend = JSON.parse(data);
                let spendList=dataSpend.gastos;
                let newSpend = {
                    id:id,
                    roommate:spend.roommate,
                    descripcion:spend.descripcion,
                    monto:spend.monto,
                }
                let indexSpend;
                let indexLastRM;
                let indexNewRM;
                let lastIndValue;
                let newIndValue= (newSpend.monto/arrRM.length);
                let diffValue;
                spendList.forEach((e,i) => {
                    if(e.id==newSpend.id){
                        lastValue=e.monto;
                        lastIndValue= (lastValue/arrRM.length);
                        diffValue= newIndValue-lastIndValue;
                        indexLastRM=arrNombres.indexOf(e.roommate);
                        indexSpend=i;
                        e.descripcion=newSpend.descripcion;
                        e.monto=newSpend.monto;
                        if(e.roommate!=newSpend.roommate){
                            indexNewRM=arrNombres.indexOf(newSpend.roommate);
                            let newValue=(e.distribution[indexLastRM]);
                            arrRM[indexLastRM].recibe-=(newValue);
                            arrRM[indexLastRM].debe-=(newValue);
                            arrRM[indexNewRM].recibe+=newValue;
                            arrRM[indexNewRM].debe+=newValue;
                            e.roommate=newSpend.roommate;
                            console.log("El monto titular antiguo es: "+newValue)
                        };
                    };
                });
                console.log("El index antiguo es: "+indexLastRM)
                console.log("El index nuevo es: "+indexNewRM)
                let gastosList=spendList[indexSpend].distribution;
                console.log("Listado pre-distribución de gastos: "+ JSON.stringify(gastosList));
                console.log("El differencial a distribuir es: "+diffValue);
                arrRM.forEach((e,i)=>{
                    if(e.nombre==newSpend.roommate){
                        e.recibe+=diffValue;
                        gastosList[i]+=diffValue;
                    }else{
                        e.debe-=diffValue;
                        gastosList[i]+=diffValue;
                    }
                })
                console.log("Listado re-distribuido de gastos: "+ JSON.stringify(gastosList));
                let contenido = JSON.stringify(dataSpend);
                fs.writeFileSync("./data/gastos.json", contenido);
                let contentRM = JSON.stringify(objRM);
                fs.writeFileSync("./data/roommates.json", contentRM);
                //console.log(dataSpend);
            } catch (error) {console.log(error);}
        }
    });
};

let deleteSpend=async(id)=>{
    let dataSpend;
    fs.readFile('./data/gastos.json',"utf8",(err,data)=>{
        if(err){
            console.log(err)
        }else{
            try {
                let targetName;
                dataSpend = JSON.parse(data);
                let spendList=dataSpend.gastos;
                let indexSpend;
                let targetSpend
                spendList.forEach((e,i) => {
                    if(e.id==id){
                        valueDsc=e.monto;
                        targetName=e.roommate;
                        indexSpend=i
                        targetSpend=spendList[indexSpend];
                        spendList.splice(i,1);
                    }
                });
                let objRM = JSON.parse(fs.readFileSync('./data/roommates.json','utf8'));
                let arrRM = objRM.roommates;                
                arrRM.forEach((e,i)=>{
                    if(e.nombre==targetName){
                        e.recibe-=targetSpend.distribution[i];
                    }else{
                        e.debe+=targetSpend.distribution[i];
                    }
                })
                /* truco para realizar ajuste contable/corrección monetaria (Pese a ello, se muestra por consola lo ajustado) */ 
                if(spendList.length==0){
                    arrRM.forEach((e,i)=>{
                        let recibe=e.recibe;
                        let debe=e.debe;
                        if(recibe!=0||debe!=0){
                            e.recibe=0;
                            e.debe=0;
                            console.log(`El Room Mate N°0${i} -${e.nombre}- sufrió un ajuste de: Recibe = $${recibe} Debe = $${debe}`)
                        }else{console.log(`Cierre de gastos cuadrado perfectamente para el Room Mate N°0${i} -${e.nombre}-`)}
                    })
                }
                let contenido = JSON.stringify(dataSpend);
                fs.writeFileSync("./data/gastos.json", contenido);
                let contentRM = JSON.stringify(objRM);
                fs.writeFileSync("./data/roommates.json", contentRM);
            } catch (error) {console.log(error);}
        }
    });
};



module.exports={
    newSpend: newSpend,
    updateSpend: updateSpend,
    deleteSpend: deleteSpend,
};