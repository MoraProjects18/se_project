const express=require("express");
const router=express.Router();
let ejs = require('ejs');
exports.getreportPage= async (req, res) => {
    res.render('./ReportIssuer/EmissionReport.ejs');
  };