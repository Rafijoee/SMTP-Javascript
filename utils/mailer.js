const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465, // gunakan 587 jika menggunakan secure: false
    secure: true, // true untuk 465, false untuk lainnya
    auth : {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

const sendEmail = (to, subject, text) => {
    const mailOptions = {
        from: process.env.EMAIL,
        to,
        subject,
        text,
    };

    return transporter.sendMail(mailOptions);
}
