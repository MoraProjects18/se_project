const reportController = require("../controllers/emission_report");
const express = require("express");
const router = express.Router();

router.get("/", reportController.getreportPage);


module.exports = router;