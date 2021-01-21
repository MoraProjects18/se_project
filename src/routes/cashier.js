const cashierController = require("../controllers/cashier");
const staffController = require("../controllers/staff");
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
cashierRouter.get("/profile",authorization.tokenAuthorize, staffController.showProfile);
cashierRouter.post("/profile",authorization.tokenAuthorize, staffController.editProfile);
cashierRouter.post("/change_pass",authorization.tokenAuthorize, staffController.changePass);

module.exports = cashierRouter;
