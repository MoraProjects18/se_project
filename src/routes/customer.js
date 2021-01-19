const customerController = require("../controllers/customer");
const express = require("express");
const router = express.Router();

router.post("/register", customerController.registerUser);
router.get("/register/confirm/:email", customerController.confirmMail);


router.get("/home", customerController.home);
router.get("/createTicket", customerController.getTicketPage);

module.exports = router;
