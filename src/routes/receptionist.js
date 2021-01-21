const express = require("express");
const receptionistRouter = express.Router();
const sorderController = require("../controllers/sorder");
const ticketController = require("../controllers/ticketController");

//Receptionist
receptionistRouter.get("/sorder/getbyid", sorderController.getbyidSO);
receptionistRouter.get("/get", sorderController.getSOPage);
receptionistRouter.post("/sorder/initiate", sorderController.initiateSO);
receptionistRouter.put("/sorder/close",sorderController.closeSO);
receptionistRouter.get("/ticket/todayTicket", ticketController.getTodayTicket);

module.exports = receptionistRouter;