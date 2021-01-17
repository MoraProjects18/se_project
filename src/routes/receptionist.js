const express = require("express");
const receptionistRouter = express.Router();
const sorderController = require("../controllers/sorder");


//Receptionist

receptionistRouter.get("/initiate", sorderController.getinitiatePage);
receptionistRouter.post("/initiate", sorderController.getallData);
receptionistRouter.post("/sorder/initiate", sorderController.initiateSO);
receptionistRouter.get("/sorder/failed", sorderController.getcontinuePage);
receptionistRouter.post("/sorder/failed", sorderController.failedSO);
receptionistRouter.post("/sorder/continue", sorderController.continueSO);
receptionistRouter.get("/sorder/gettodaySO", sorderController.gettodaySO);
receptionistRouter.get("/sorder/search", sorderController.getSearchPage);
receptionistRouter.post("/sorder/search", sorderController.getbyidSO);
receptionistRouter.post("/addvehicle", sorderController.postvehicle);

//receptionistRouter.put("/sorder/close",sorderController.closeSO);


module.exports = receptionistRouter;