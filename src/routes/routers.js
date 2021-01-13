const cashierController = require("../controllers/cashier");
const reportController = require("../controllers/emission_report");

const express = require("express");
const cashierRouter = express.Router();
const receptionsitRouter = express.Router();

//Controllers

//Customer

//Receptionist
// receptionsitRouter.get("/", cashierController.getInvoice);

//Cashier
cashierRouter.get("/", cashierController.getInvoicePage);
cashierRouter.post("/invoice", cashierController.searchInvoice);
cashierRouter.post("/test", cashierController.createInvoice);

// router.get("/", reportController.getreportPage);

module.exports = cashierRouter;
