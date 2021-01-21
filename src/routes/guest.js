const guestController = require("../controllers/guest");
const express = require("express");
const router = express.Router();

router.get("/", guestController.home);

module.exports = router;
