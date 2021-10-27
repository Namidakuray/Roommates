/* [1.] Ocupar el módulo File System para la manipulación de archivos alojados en el
servidor */
const fs = require('fs');
const { v4: uuidv4 } = require("uuid");
const axios = require('axios');

/* [3.(2)] para obtener la data de un nuevo usuario y la acumule
en un JSON. El objeto correspondiente al usuario que se almacenará debe tener un id generado
con el paquete UUID. */
let getNewUser=async()=>{
    let {data} = await axios('https://randomuser.me/api');
    let user = data.results
    let newUser = {
        id:uuidv4().slice(30),
        nombre:user[0].name.first + " " + user[0].name.last,
        age:user[0].dob.age,
        email:user[0].email,
        debe: 0,
        recibe: 0
    }
    //console.log(newUser);
    return newUser;
};

let saveNewUser=async(newUser)=>{
    let dataUsers;
    fs.readFile('./data/roommates.json',"utf8",(err,data)=>{
        if(err){
            console.log(err)
        }else{
            try {
                dataUsers = JSON.parse(data);
                let roommates=dataUsers.roommates;
                roommates.push(newUser);
                
                let dataSpend=JSON.parse(fs.readFileSync('./data/gastos.json',"utf8"));
                let gastos=dataSpend.gastos;
                if(gastos.length==0){ //manejar situación en caso de agregar usuarios sin gastos en el historial.
                    console.log('sin deudas por distribuir')
                    let contenido = JSON.stringify(dataUsers);
                    fs.writeFileSync("./data/roommates.json", contenido);
                }else{
                    
                    gastos.forEach((e,i)=>{
                        let targetList=e.distribution;
                        let spend=e.monto;
                        let lastIndValue=(spend/(roommates.length-1));
                        let newIndValue=(spend/(roommates.length));
                        let diffNewUser=lastIndValue-newIndValue;
                        let diffUsers=lastIndValue-((spend-diffNewUser)/(roommates.length-1));
                        console.log('------------------------------------------------------');
                        console.log("Gasto N°"+i+" a repartir: "+spend);
                        console.log("Participación con "+(roommates.length-1)+" integrantes: "+lastIndValue);
                        console.log("Participación con "+(roommates.length)+" integrantes: "+newIndValue);
                        console.log("Participación nuevo room mate: "+diffNewUser);
                        console.log("Diferencial por room mate: "+diffUsers);
                        console.log('------------------------------------------------------');
                        let titular=e.roommate;
                        let currUser=newUser.nombre;
                        roommates.forEach((e,i)=>{
                            if(e.nombre==titular){
                                e.recibe-=diffUsers
                                targetList[i]-=diffUsers
                            }else if(e.nombre!=currUser&&e.debe==0){
                                e.recibe+=diffUsers
                                targetList[i]+=diffUsers
                            }else if(e.nombre==currUser){
                                e.debe-=diffNewUser
                                targetList.push(diffNewUser)
                            }else{
                                e.debe+=diffUsers
                                targetList[i]-=diffUsers
                            };
                        });
                    });
                    let spendContent = JSON.stringify(dataSpend);
                    fs.writeFileSync("./data/gastos.json", spendContent);    
                    let contenido = JSON.stringify(dataUsers);
                    fs.writeFileSync("./data/roommates.json", contenido);
                }
                
                //console.log(dataUsers);
            } catch (error) {console.log(error);}
        }
    });
};
let addRoomMate=async()=>{
    let data = await getNewUser();
    await saveNewUser(data);
    return data;
}

module.exports=addRoomMate;