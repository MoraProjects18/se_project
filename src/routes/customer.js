const customerController = require("../controllers/customer");
const express = require("express");
const customerRouter = express.Router();
const sorderController = require("../controllers/sorder");

//Customer
customerRouter.get("/getmyso", sorderController.getmySO);
customerRouter.get("/profile",customerController.showProfile);
customerRouter.post("/edit_profile",customerController.editProfile);
customerRouter.post("/change_pass",customerController.changePass);
customerRouter.post("/register", customerController.registerUser);
customerRouter.get("/register/confirm/:email", customerController.confirmMail);

module.exports = customerRouter;

