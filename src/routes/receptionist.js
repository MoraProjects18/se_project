const express = require("express");
const receptionistRouter = express.Router();
const sorderController = require("../controllers/sorder");


//Receptionist
//receptionistRouter.get("/sorder/getbyid", sorderController.getbyidSO);
//receptionistRouter.get("/get", sorderController.getSOPage);
receptionistRouter.get("/", sorderController.getinitiatePage);
receptionistRouter.get("/sorder/failed", sorderController.getcontinuePage);
receptionistRouter.post("/", sorderController.getallData);
receptionistRouter.get("/sorder/gettodaySO", sorderController.gettodaySO);
receptionistRouter.post("/sorder/initiate", sorderController.initiateSO);
receptionistRouter.post("/sorder/failed", sorderController.failedSO);
receptionistRouter.post("/sorder/continue", sorderController.continueSO);
//receptionistRouter.put("/sorder/close",sorderController.closeSO);


module.exports = receptionistRouter;