const ticketController = require("../controllers/ticketController");
const express = require("express");
const router = express.Router();

const authorization = require("../middlewares/authorization");




router.post("/create",authorization.tokenAuthorize, ticketController.createTicket);

router.get("/gettimeslot", ticketController.getTimes);

module.exports = router;