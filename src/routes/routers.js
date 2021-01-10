const express = require("express");
const cashierRouter = express.Router();
const receptionsitRouter = express.Router();

//Controllers
const cashierController = require("../controllers/cashier");

//Customer

//Receptionist
receptionsitRouter.get("/", cashierController.getInvoice);

//Cashier
cashierRouter.get("/", cashierController.getInvoice);
cashierRouter.post("/invoice", cashierController.payInvoice);

module.exports = cashierRouter;
module.exports = receptionsitRouter;
