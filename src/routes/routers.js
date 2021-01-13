const cashierController = require("../controllers/cashier");
const reportController = require("../controllers/emission_report");

const express = require("express");
const cashierRouter = express.Router();
const receptionistRouter = express.Router();

//Controllers

//Customer

//Receptionist
// receptionsitRouter.get("/", cashierController.getInvoice);

//Cashier
cashierRouter.get("/", cashierController.getInvoicePage);
cashierRouter.get("/invoice", cashierController.searchInvoice);

// router.get("/", reportController.getreportPage);


module.exports = cashierRouter;