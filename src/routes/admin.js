const adminController = require("../controllers/admin");
const staffController = require("../controllers/staff");
const express = require("express");
const authorization = require("../middlewares/authorization");
const router = express.Router();

router.get(
  "/addStaff",
  authorization.tokenAuthorize,
  authorization.isAdminRole,
  adminController.getAddEmployeePage
);
router.post(
  "/addStaff",
  authorization.tokenAuthorize,
  authorization.isAdminRole,
  adminController.registerUser
);
router.get(
  "/home",
  authorization.tokenAuthorize,
  authorization.isAdminRole,
  adminController.home
);
router.get(
  "/profile",
  authorization.tokenAuthorize,
  authorization.isAdminRole,
  staffController.showProfile
);

module.exports = router;
