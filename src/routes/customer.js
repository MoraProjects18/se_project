const express = require("express");
const customerRouter = express.Router();
const sorderController = require("../controllers/sorder");
const customerController = require("../controllers/customer");

//Customer
customerRouter.get("/getmyso", sorderController.getmySO);
customerRouter.get("/profile",customerController.showProfile);
customerRouter.post("/edit_profile",customerController.editProfile);
customerRouter.post("/change_pass",customerController.changePass);
module.exports = customerRouter;