const cashierController = require("../controllers/cashier");
const reportController = require("../controllers/emission_report");
const sorderController = require("../controllers/sorder");


const express = require("express");
const cashierRouter = express.Router();
const receptionistRouter = express.Router();

//Controllers

//Customer

//Receptionist
// receptionsitRouter.get("/", cashierController.getInvoice);
receptionistRouter.get("/sorder/getbyid", sorderController.getbyidSO);
receptionistRouter.post("/sorder/initiate", sorderController.initiateSO);
receptionistRouter.put("/sorder/close",sorderController.closeSO);

//Cashier
cashierRouter.get("/", cashierController.getInvoicePage);
cashierRouter.post("/", cashierController.searchInvoice);
//cashierRouter.get("/invoice", cashierController.searchInvoice);
// cashierRouter.post("/test", cashierController.createInvoice);

// router.get("/", reportController.getreportPage);


module.exports = cashierRouter;
module.exports = receptionistRouter;
