const addRoomMate = require('./controller/usersCtrl'); //[3.(2)]
const {updateSpend,newSpend,deleteSpend} = require('./controller/gastosCtrl');
/* const MailerCtrl = require('./controller/mailerCtrl'); */


/* NOTA: Requerimiento 5. Devolver los códigos de estado HTTP correspondientes a cada situación.
Representado en la utilización de códigos: 200,201,500. */

const http = require('http');
/* [1.] Ocupar el módulo File System para la manipulación de archivos alojados en el
servidor */
const fs = require('fs');
const url = require('url');
let port = 3000;

/* Inicialización de estructura de archivos. */
(()=>{
    try {
        if(fs.existsSync("./data/")){
            console.log('Directory of Data already exist')
        }else{
            fs.mkdirSync("./data/");
            console.log('Directory of Data is created');
        }
        if(fs.existsSync("./data/roommates.json" && "./data/gastos.json")){
            console.log('files to save the roomateData already exist');
        }else{
            let userContent = `{"roommates":[]}`;
            let spendContent = `{"gastos":[]}`;
            fs.writeFileSync("./data/roommates.json", userContent);
            fs.writeFileSync("./data/gastos.json", spendContent);
            console.log('file to save the roomateData is created');
        }
    } catch (error) {console.log(error);}
})();
let resetAll=async()=>{
    let userContent = `{"roommates":[]}`;
    let spendContent = `{"gastos":[]}`;
    fs.writeFileSync("./data/roommates.json", userContent);
    fs.writeFileSync("./data/gastos.json", spendContent);
    console.log('files cleared');
}
/* let sendLogic=async()=>{
    let emails=MailerCtrl.emails;
    if(myEmail){
        emails.push(myEmail);
        console.log('Email send to personal email provider');
    }else{console.log('Don´t personal email provider')}
    try {
        currentData.forEach((e)=>{
        contenido += `el valor del ${e.type} el día de hoy es: $ ${e.value} <br>`
        });
    } catch (error) {
        console.log(error);
    }


    try {
        mailToSend = await SEND(correos,asunto,contenido);
        console.log(mailToSend);
        res.write(
            `<p class="alert alert-info w-25 m-auto text-center"> ¡Envío exitoso! </p>`,
            (err)=>res.end()
            );

        try {
            saveMail(correos,asunto,contenido);
        } catch (error) {console.log(error)}

    } catch (error) {
        console.log(error)
    };
    res.end();

} */

/* [4.] Crear una API REST */
http
    .createServer(async(req, res)=>{
        let method = req.method;
        let { id } = url.parse(req.url,true).query;
        let urlReq = req.url;
        
        if(urlReq === '/'){     //Se disponibiliza ruta inicial
            res.writeHead(200,{'Content-Type':'text/html'})
            fs.readFile('./web/index.html',(err,data)=>{
                if(err){console.log(err)};
                if(data){res.end(data)};
            })
        }
        
        if(urlReq == '/resetAll'){
            try {
                await resetAll();
                res.end();
            } catch (error) {
                res.writeHead(500,{'Content-Type':'text/html'});
                res.end('Error to process the petition');
                console.log(error);
            }
        }

        /* [3.(1)] preparar una ruta POST /roommate en el servidor que
        ejecute una función asíncrona importada de un archivo externo al del servidor */
        if(urlReq == '/roommate' && method == 'POST'){  //Se disponibiliza ruta para crear nuevo roomMate
            try {
                res.writeHead(201,{'Content-Type':'application/json'});
                let jsonNewRM=await addRoomMate();
                let newRM=JSON.stringify(jsonNewRM);
                //console.log(newRM);
                res.end(newRM);
            } catch (error) {
    /* [2.] Capturar los errores para condicionar el código a través del manejo de excepciones. */
                res.writeHead(500,{'Content-Type':'text/html'});
                res.end('Error to process the petition');
                console.log(error);
            };
        }
        
        /* [e.] GET /roommates: */
        if(urlReq == '/roommates'){ //Se disponibiliza ruta de consulta de roomMates registrados
            try {
                res.writeHead(200,{'Content-Type':'application/json'})
                let strUserList=fs.readFileSync('./data/roommates.json','utf8');
                res.end(strUserList);
            } catch (error) {console.log(error)}
        }
        
        /* [a.] GET /gastos: */
        if(urlReq == '/gastos'){    //Se disponibiliza ruta para consultar los gastos registrados
            try {
                res.writeHead(200,{'Content-Type':'application/json'})
                let strGastosList=fs.readFileSync('./data/gastos.json','utf8',(err,data)=>{console.log(data)});
                res.end(strGastosList);
            } catch (error) {
    /* [2.] Capturar los errores para condicionar el código a través del manejo de excepciones. */
                res.writeHead(500,{'Content-Type':'text/html'});
                res.end('Resource can´t find');
                console.log(error)
            }
        }
        
        /* [b.] POST /gasto: */
        if(urlReq == '/gasto' && method == 'POST'){ //Se disponibiliza ruta para crear gastos según roomMates seleccionado
            try {
                let body = '';
                req.on('data',(stdOut)=>{
                    body += stdOut.toString();
                });
                req.on('end',async (err)=>{
                    if(err){
                        console.log(err)
                    }else{
                    let dataIn = JSON.parse(body);
                    //console.log(dataIn);
                    await newSpend(dataIn);
                    res.end();
                    }
                });
            } catch (error) {
                res.writeHead(500,{'Content-Type':'text/html'});
                res.end('Error to process the petition');
                console.log(error);
            }
        }
        
        /* [c.] PUT /gasto: */
        if(urlReq.startsWith('/gasto') && method =='PUT'){  //Se disponibiliza ruta para editar los gastos según id del gasto
            try {
                let body = '';
                req.on('data',(stdOut)=>{
                    body += stdOut.toString();
                });
                req.on('end',async (err)=>{
                    if(err){
                        console.log(err)
                    }else{
                        try {
                            let dataIn = JSON.parse(body);
                            //console.log(dataIn);
                            await updateSpend(dataIn, id);
                            res.end();
                        } catch (error) {console.log(error)}
                    }
                });
            } catch (error) {
                res.writeHead(500,{'Content-Type':'text/html'});
                res.end('Error to process the petition');
                console.log(error);
            }
        }
        
        /* [d.] DELETE /gasto: */
        if(urlReq.startsWith('/gasto') && method == 'DELETE'){  //Se disponibiliza ruta para eliminar gastos según id
            try {
                await deleteSpend(id);
                res.end();
            } catch (error) {console.log(error)}
        }
    }).listen(port, ()=>console.log('Server on port: ' + port))


