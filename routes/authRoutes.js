const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/authController");

router.post("/register", AuthController.register);

router.get("/confirm-email/:token", AuthController.confirmEmail);


module.exports = router;
