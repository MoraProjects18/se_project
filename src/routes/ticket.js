const ticketController = require("../controllers/ticketController");
const express = require("express");
const router = express.Router();

router.get("/viewTable", ticketController.getUserTicket);
router.get("/todayTicket", ticketController.getTodayTicket);
router.get("/createTicket", ticketController.getTicketPage);
router.post("/create", ticketController.createTicket);



module.exports = router;