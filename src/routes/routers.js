const cashierController = require("../controllers/cashier");
const reportController = require("../controllers/emission_report");
const authorization = require("../middlewares/authorization");

const express = require("express");
const cashierRouter = express.Router();

//Cashier
cashierRouter.get(
  "/invoice",
  authorization.tokenAuthorize,
  authorization.isCashierRole,
  cashierController.getInvoicePage
);
cashierRouter.post(
  "/invoice",
  authorization.tokenAuthorize,
  authorization.isCashierRole,
  cashierController.searchInvoice
);
cashierRouter.post(
  "/invoice/pay",
  authorization.tokenAuthorize,
  authorization.isCashierRole,
  cashierController.payInvoice
);
cashierRouter.post(
  "/invoice/close",
  authorization.tokenAuthorize,
  authorization.isCashierRole,
  cashierController.closeServiceOrder
);

module.exports = cashierRouter;
