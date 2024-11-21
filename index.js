const nodemailer = require('nodemailer');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;


const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465, // gunakan 587 jika menggunakan secure: false
    secure: true, // true untuk 465, false untuk lainnya
    auth : {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

const mailOptions = {
    from: process.env.EMAIL,
    to: 'ragijoe43@gmail.com',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!',
    html: '<h1>Welcome</h1><p>That was easy!</p>'
};

transporter.sendMail(mailOptions, function(error, info){
    if(error){
        console.log(error, "ini errornyaaa");
    }else{
        console.log('Email sent: ' + info.response);
    }
});