const express = require("express");
const cashierRouter = express.Router();
const receptionistRouter = express.Router();

//Controllers
const cashierController = require("../controllers/cashier");
const sorderController = require("../controllers/sorder");

//Customer

//Receptionist
receptionistRouter.get("/", cashierController.getInvoice);
receptionistRouter.post("/sorder/initiate", sorderController.initiateSO);

//Cashier
cashierRouter.get("/", cashierController.getInvoice);
cashierRouter.post("/invoice", cashierController.payInvoice);


module.exports = cashierRouter;
module.exports = receptionistRouter;

