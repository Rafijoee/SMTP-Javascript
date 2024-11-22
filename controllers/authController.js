require("dotenv").config();
const prisma = require("../models/prisma.js");
const bcrypt = require("bcrypt");
const {sendEmail} = require("../utils/mailer.js");


class AuthController {
    static async register(req, res){
        try{
            const {email, password, name} = req.body;
            if(!email || !password || !name){
                return res.status(400).send({message: "Email, password, and name are required"});
            }
            const checkEmail = await prisma.user.findUnique({
                where: {
                    email : email
                }
            });
            if(checkEmail){
                return res.status(400).send({message: "Email already exists"});
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name
                }
            });

            const subject = "Registrasi Berhasil!";
            const text = `Halo, ${name}!\n\nTerima kasih telah mendaftar di layanan kami.\n\nSalam,\nTim Kami`;
            await sendEmail(email, subject, text);
            res.status(201).send({message: "User created", data: user});

        }
        catch(error){
            console.error(error);
            res.status(500).send({message: "Internal server error"});
        }
    }
}

module.exports = AuthController;