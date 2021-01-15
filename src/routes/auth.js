const authController = require("../controllers/auth");
const express = require("express");
const router = express.Router();

router.post("/register", authController.registerUser);

module.exports = router;
