const cashierController = require("../controllers/cashier");
const staffController = require("../controllers/staff");
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
  "/searchInvoiceBySO",
  authorization.tokenAuthorize,
  authorization.isCashierRole,
  cashierController.searchInvoiceBySO
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

// router.get("/", reportController.getreportPage);
cashierRouter.get(
  "/home",
  authorization.tokenAuthorize,
  authorization.isCashierRole,
  cashierController.home
);
cashierRouter.get(
  "/profile",
  authorization.tokenAuthorize,
  authorization.isCashierRole,
  staffController.showProfile
);

module.exports = cashierRouter;
