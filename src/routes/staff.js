const staffController = require("../controllers/staff");
const authorization = require("../middlewares/authorization")

const express = require("express");
const staffRouter = express.Router();

staffRouter.get("/profile",authorization.tokenAuthorize,staffController.showProfile);
staffRouter.post("/edit_profile",authorization.tokenAuthorize,staffController.editProfile);
staffRouter.post("/change_pass",authorization.tokenAuthorize,staffController.changePass);

module.exports=staffRouter;