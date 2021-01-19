const cashierController = require("../controllers/cashier");
const reportController = require("../controllers/emission_report");

const express = require("express");
const cashierRouter = express.Router();

// //Customer

//Receptionist
// receptionsitRouter.get("/", cashierController.getInvoice);

//Cashier
cashierRouter.get("/", cashierController.getInvoicePage);
cashierRouter.post("/", cashierController.searchInvoice);
cashierRouter.post("/invoice/pay", cashierController.payInvoice);
cashierRouter.post("/invoice/close", cashierController.closeServiceOrder);

// router.get("/", reportController.getreportPage);
cashierRouter.get("/home", cashierController.home);

module.exports = cashierRouter;
