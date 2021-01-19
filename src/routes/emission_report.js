const reportController = require("../controllers/emission_report");
const express = require("express");
const router = express.Router();

router.get("/", reportController.getreportPage);
//router.get("/json/:id", reportController.getjson);
router.get("/get_report/:id/html", reportController.getreporthtml);
router.get("/get_report/:id/pdf", reportController.getreportpdf);
router.post("/get_final_report", reportController.postreport);
router.post("/view_final_report", reportController.viewreport);

module.exports = router;