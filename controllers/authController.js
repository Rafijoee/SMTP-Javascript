require("dotenv").config();
const prisma = require("../models/prisma.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {sendEmail} = require("../utils/mailer.js");
const { getIO } = require("../middlewares/socket.js");


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

            // const subject = "Registrasi Berhasil!";
            // const text = `Halo, ${name}!\n\nTerima kasih telah mendaftar di layanan kami.\n\nSalam,\nTim Kami`;
            // await sendEmail(email, subject, text);
            // res.status(201).send({message: "User created", data: user});

            const io = getIO();
            io.emit(
                "welcomeNotification",
                `welcome ${name}! akun anda berhasil dibuat !`
            );

            const token = jwt.sign({id: user.id, email: user.email}, process.env.JWT_SECRET, {expiresIn: "1h"});
            const confirmationLink = `http//:${req.get(
                "host"
            )}api/v1/auth/confirm-email/${token}`;

            const subject = "Registrasi Berhasil!";
            const text = `Halo, ${name}!\n\nTerima kasih telah mendaftar di layanan kami. Silakan klik link berikut untuk mengkonfirmasi email Anda:\n\n${confirmationLink}\n\nSalam,\nTim Kami`;
            await sendEmail(email, subject, text);

            res.status(201).json({
                message: "User created", 
                data: {user, confirmationLink}
            });

        }
        catch(error){
            console.error(error);
            io.emit("registrationError", "Terjadi kesalahan pada server.");
            res.status(500).send({message: "Internal server error"});
        }
    }

    static async confirmEmail(req, res){
        const io = getIO();
        try{
            const {token} = req.params;
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (!decoded) {
                return res.status(400).send({ message: "Invalid token" });
            }
            const user = await prisma.user.findUnique({
                where: {
                    id: decoded.id,
                    email : decoded.email
                }
            });
            if (!user) {
                return res.status(404).send({ message: "User not found" });
            }
            await prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    confirmed: true
                }
            });

            io.emit (
                "emailConfirmation",
                `Email ${user.email} berhasil dikonfirmasi!`
            );
            res.render("confirm-email", {
                title: "Confirm Email",
                error: null,
                message: "Email telah berhasil dikonfirmasi. Silahkan login.",
            });

        } catch (error) {
            console.log(error);
            return res.render("confirm-email", {
                title: "Confirm Email",
                error: "Internal server error",
                message: null,
            });
        }
    }
}

module.exports = AuthController;