const authController = require("../controllers/auth");
const authorization = require("../middlewares/authorization");
const express = require("express");
const router = express.Router();

router.post("/login", authorization.isAlreadyLogin, authController.login);

router.get("/login", authorization.isAlreadyLogin, authController.getLoginPage);

module.exports = router;
