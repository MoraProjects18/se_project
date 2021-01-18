const staffController = require("../controllers/staff");


const express = require("express");
const staffRouter = express.Router();

staffRouter.get("/profile",staffController.showProfile);

module.exports=staffRouter;