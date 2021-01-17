const adminController = require("../controllers/admin");
const express = require("express");
const router = express.Router();

router.get("/add_employee",adminController.getAddEmployeePage);
router.post("addStaff",adminController.registerUser);

module.exports=router;