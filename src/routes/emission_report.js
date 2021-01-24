const reportController = require("../controllers/emission_report");
const staffController = require("../controllers/staff");
const express = require("express");
const router = express.Router();
const authorization = require("../middlewares/authorization");

router.get(
  "/report",
  authorization.tokenAuthorize,
  authorization.isReportIssuerRole,
  reportController.getreportPage
);

router.get(
  "/get_report/:id/html",
  authorization.tokenAuthorize,
  authorization.isReportIssuerRole,
  reportController.getreporthtml
);
router.get("/get_report/:id/pdf", reportController.getreportpdf);

router.post(
  "/get_final_report",
  authorization.tokenAuthorize,
  authorization.isReportIssuerRole,
  reportController.postreport
);
router.post(
  "/view_final_report",
  authorization.tokenAuthorize,
  authorization.isReportIssuerRole,
  reportController.viewreport
);

router.get(
  "/home",
  authorization.tokenAuthorize,
  authorization.isReportIssuerRole,
  reportController.home
);

router.get(
  "/profile",
  authorization.tokenAuthorize,
  authorization.isReportIssuerRole,
  staffController.showProfile
);

module.exports = router;
