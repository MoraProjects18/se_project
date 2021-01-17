const customerController = require("../controllers/customer");
const express = require("express");
const router = express.Router();

router.post("/register", customerController.registerUser);
router.get("/register", customerController.getRegisterPage);
router.get("/register/confirm/:email", customerController.confirmMail);

module.exports = router;
