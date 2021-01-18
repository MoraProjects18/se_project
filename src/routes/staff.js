const staffController = require("../controllers/staff");


const express = require("express");
const staffRouter = express.Router();

staffRouter.get("/profile",staffController.showProfile);
staffRouter.post("/edit_profile",staffController.editProfile);
staffRouter.post("/change_pass",staffController.changePass);
module.exports=staffRouter;