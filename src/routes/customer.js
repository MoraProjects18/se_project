const express = require("express");
const router = express.Router();
const sorderController = require("../controllers/sorder");
const customerController = require("../controllers/customer");
const authorization = require("../middlewares/authorization");

router.get(
  "/getmyso",
  authorization.tokenAuthorize,
  authorization.isCustomerRole,
  sorderController.getmySO
);
router.get(
  "/profile",
  authorization.tokenAuthorize,
  authorization.isCustomerRole,
  customerController.showProfile
);
router.post(
  "/edit_profile",
  authorization.tokenAuthorize,
  authorization.isCustomerRole,
  customerController.editProfile
);
router.post(
  "/change_pass",
  authorization.tokenAuthorize,
  authorization.isCustomerRole,
  customerController.changePass
);
router.get("/register", customerController.getRegisterPage);
router.post("/register", customerController.registerUser);
router.get("/register/confirm/:email", customerController.confirmMail);
router.get("/home",authorization.tokenAuthorize, authorization.isCustomerRole, authorization.isEmailVerified, customerController.home);

router.get(
  "/createTicket",
  authorization.tokenAuthorize,
  authorization.isCustomerRole,
  customerController.getTicketPage
);

router.post(
  "/cancelTicket",
  authorization.tokenAuthorize,
  authorization.isCustomerRole,
  customerController.cancelTicket
);


router.get(
  "/ticketDetails",
  authorization.tokenAuthorize,
  authorization.isCustomerRole,
  customerController.getUserTicket
);

module.exports = router;
