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
//cashierRouter.get("/invoice", cashierController.searchInvoice);
// cashierRouter.post("/test", cashierController.createInvoice);

// router.get("/", reportController.getreportPage);


module.exports = cashierRouter;
