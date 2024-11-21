require("dotenv").config();
const prisma = require("../models/prismaClients.js");
const bcrypt = require("bcrypt");
const {sendEmail} = require("../utils/mailer.js");


class Authenticate{
    static async register(req, res){
        try{
            const {email, password, name} = req.body;



        }catch(error){
            console.error(error);
            res.status(500).send({message: "Internal server error"});
        }
    }
}