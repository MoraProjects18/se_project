const ticketController = require("../controllers/ticketController");
const express = require("express");
const router = express.Router();

router.get("/viewTicket", ticketController.getUserTicket);
router.get("/todayTicket", ticketController.getTodayTicket);
router.get("/createTicket", ticketController.getTicketPage);
router.post("/create", ticketController.createTicket);

router.get("/gettimeslot", ticketController.getTimes);

module.exports = router;