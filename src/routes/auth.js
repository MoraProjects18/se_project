const authController = require("../controllers/auth");
const express = require("express");
const router = express.Router();

router.post("/", authController.registerUser);

module.exports = router;
