const authController = require("../controllers/auth");
const authorization = require("../middlewares/authorization");
const express = require("express");
const router = express.Router();

router.post("/login", authController.login);

router.get("/login", authController.getLoginPage);

router.get("/logout", authorization.tokenAuthorize, authController.logout);

module.exports = router;
