const guestController = require("../controllers/guest");
const express = require("express");
const router = express.Router();
const authorization = require("../middlewares/authorization");

router.get("/", authorization.isGuestUser, guestController.home);

module.exports = router;
