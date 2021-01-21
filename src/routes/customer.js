const express = require("express");
const router = express.Router();
const sorderController = require("../controllers/sorder");
const authorization = require("../middlewares/authorization");

router.get("/getmyso", sorderController.getmySO);
router.get("/profile",authorization.tokenAuthorize, customerController.showProfile);
router.post("/edit_profile",authorization.tokenAuthorize, customerController.editProfile);
router.post("/change_pass", authorization.tokenAuthorize,customerController.changePass);
router.post(
  "/register",
  authorization.isAlreadyLogin,
  customerController.registerUser
);
router.get("/register/confirm/:email", customerController.confirmMail);
router.get("/home", customerController.home);
router.get("/createTicket", customerController.getTicketPage);
router.get(
  "/register",
  authorization.isAlreadyLogin,
  customerController.getRegisterPage
);

module.exports = customerRouter;