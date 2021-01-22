const express = require("express");
const receptionistRouter = express.Router();
const sorderController = require("../controllers/sorder");
const staffController = require("../controllers/staff");
const authorization = require("../middlewares/authorization");

//Receptionist
receptionistRouter.get(
  "/home",
  authorization.tokenAuthorize,
  authorization.isReceptionistsRole,
  sorderController.getHomePage
);
receptionistRouter.get(
  "/initiate",
  authorization.tokenAuthorize,
  authorization.isReceptionistsRole,
  sorderController.getinitiatePage
);
receptionistRouter.post(
  "/initiate",
  authorization.tokenAuthorize,
  authorization.isReceptionistsRole,
  sorderController.getallData
);
receptionistRouter.post(
  "/sorder/initiate",
  authorization.tokenAuthorize,
  authorization.isReceptionistsRole,
  sorderController.initiateSO
);
receptionistRouter.get(
  "/sorder/failed",
  authorization.tokenAuthorize,
  authorization.isReceptionistsRole,
  sorderController.getcontinuePage
);
receptionistRouter.post(
  "/sorder/failed",
  authorization.tokenAuthorize,
  authorization.isReceptionistsRole,
  sorderController.failedSO
);
receptionistRouter.post(
  "/sorder/continue",
  authorization.tokenAuthorize,
  authorization.isReceptionistsRole,
  sorderController.continueSO
);
receptionistRouter.get(
  "/sorder/gettodaySO",
  authorization.tokenAuthorize,
  authorization.isReceptionistsRole,
  sorderController.gettodaySO
);
receptionistRouter.get(
  "/sorder/search",
  authorization.tokenAuthorize,
  authorization.isReceptionistsRole,
  sorderController.getSearchPage
);
receptionistRouter.post(
  "/sorder/search",
  authorization.tokenAuthorize,
  authorization.isReceptionistsRole,
  sorderController.getbyidSO
);
receptionistRouter.post(
  "/addvehicle",
  authorization.tokenAuthorize,
  authorization.isReceptionistsRole,
  sorderController.postvehicle
);
receptionistRouter.get(
  "/profile",
  authorization.tokenAuthorize,
  authorization.isReceptionistsRole,
  staffController.showProfile
);

module.exports = receptionistRouter;
