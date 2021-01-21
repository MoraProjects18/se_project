const cashierController = require("../controllers/cashier");
const reportController = require("../controllers/emission_report");
const authorization = require("../middlewares/authorization");

const express = require("express");
const cashierRouter = express.Router();

//Cashier
cashierRouter.get("/invoice", cashierController.getInvoicePage);
cashierRouter.post("/invoice", cashierController.searchInvoice);
cashierRouter.post("/invoice/pay", cashierController.payInvoice);
cashierRouter.post("/invoice/close", cashierController.closeServiceOrder);

// router.get("/", reportController.getreportPage);
cashierRouter.get("/home", cashierController.home);

module.exports = cashierRouter;
