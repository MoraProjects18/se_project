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
cashierRouter.get("/profile", staffController.showProfile);
cashierRouter.post("/profile", staffController.editProfile);
cashierRouter.post("/profile/password", staffController.changePass);

module.exports = cashierRouter;
