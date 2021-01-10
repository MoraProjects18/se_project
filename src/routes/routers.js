const express = require("express");
const router = express.Router();

//Controllers
const cashierController = require("../controllers/cashier");

//Customer

//Receptionist

//Cashier
router.post("/invoice", cashierController.payInvoice);

module.exports = router;
