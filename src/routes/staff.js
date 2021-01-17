const staffController = require("../controllers/staff");


const express = require("express");
const staffRouter = express.Router();

staffRouter.get("/",staffController.showProfile);

module.exports=staffRouter;