const authController = require("../controllers/auth");
const authorization = require("../middlewares/authorization");
const express = require("express");
const router = express.Router();

router.post(
  "/login",
  authorization.tokenAuthorize,
  authorization.isAlreadyLogin,
  authController.login
);

module.exports = router;
