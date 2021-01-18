const express = require("express");
const customerRouter = express.Router();
const sorderController = require("../controllers/sorder");
const customerController = require("../controllers/customer");

//Customer
customerRouter.get("/getmyso", sorderController.getmySO);
customerRouter.get("/profile",customerController.showProfile);

module.exports = customerRouter;