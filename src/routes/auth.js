const authController = require("../controllers/auth");
const express = require("express");
const router = express.Router();

router.post("/login", authorization.isAlreadyLogin, authController.login);

router.get("/login", authorization.isAlreadyLogin, authController.getLoginPage);

router.get("/logout", authorization.tokenAuthorize, authController.logout);

module.exports = router;
