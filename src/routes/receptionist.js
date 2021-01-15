const express = require("express");
const receptionistRouter = express.Router();
const sorderController = require("../controllers/sorder");


//Receptionist
receptionistRouter.get("/sorder/getbyid", sorderController.getbyidSO);
receptionistRouter.get("/get", sorderController.getSOPage);
receptionistRouter.get("/sorder/gettodaySO", sorderController.gettodaySO);
receptionistRouter.post("/sorder/initiate", sorderController.initiateSO);
receptionistRouter.put("/sorder/close",sorderController.closeSO);


module.exports = receptionistRouter;