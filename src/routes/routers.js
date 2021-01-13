const cashierController = require("../controllers/cashier");
const reportController = require("../controllers/emission_report");

const express = require("express");
const cashierRouter = express.Router();
const receptionistRouter = express.Router();

//Controllers
<<<<<<< HEAD
const cashierController = require("../controllers/cashier");
const sorderController = require("../controllers/sorder");
=======
>>>>>>> dilshan

//Customer

//Receptionist
<<<<<<< HEAD
receptionistRouter.get("/", cashierController.getInvoice);
receptionistRouter.post("/sorder/initiate", sorderController.initiateSO);
=======
// receptionsitRouter.get("/", cashierController.getInvoice);
>>>>>>> dilshan

//Cashier
cashierRouter.get("/", cashierController.getInvoicePage);
cashierRouter.get("/invoice", cashierController.searchInvoice);

// router.get("/", reportController.getreportPage);


module.exports = cashierRouter;
<<<<<<< HEAD
module.exports = receptionistRouter;

=======
>>>>>>> dilshan
