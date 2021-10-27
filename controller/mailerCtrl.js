const nodemailer = require('nodemailer');
const fs = require('fs');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: 'fullstack.js.0028@gmail.com',
        pass: 'Edutecno.2021'
    }
});

let dataRM=JSON.parse(fs.readFileSync('./data/roommates.json',"utf8"));
let roomMate=dataRM.roommates;
let emails=roomMate.map((e)=>e.email)
let names=roomMate.map((e)=>e.nombre)


let send=async (to, subject, content)=>{
    let options = {
        from: '"Room Mates Mannager"<nodemailer@gmail.com>',
        to,
        subject,
        html: content
    }
    transporter.sendMail(options,(err,data)=>{if(err)console.log(err);if(data)return data});
};

module.exports={
    send,
    emails,
    names,
};