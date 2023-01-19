const express = require("express");
const userController = require("../controller/userController");

const router = express.Router();

// register 
router.post("/register",userController.userRegistration);

// login 
router.post("/login",userController.userLogin);

module.exports = router;

