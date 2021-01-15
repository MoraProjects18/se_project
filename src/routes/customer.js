const express = require("express");
const customerRouter = express.Router();
const sorderController = require("../controllers/sorder");

//Customer
customerRouter.get("/getmyso", sorderController.getmySO);

module.exports = customerRouter;