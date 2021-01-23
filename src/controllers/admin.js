const joiSupporter = require("../utils/joi-supporter");
const jwt = require("jsonwebtoken");
const path = require("path");
const Email = require("../utils/email");
const config = require("config");
const Staff = require("../models/staff");
const staff = new Staff();
const Ticket = require("../models/ticket.js");
const ticket = new Ticket();

exports.home = async (req, res) => {
  res.render("./common/staff_home_page.ejs", {
    usertype: "admin",
    activepage: "Home",
    title: "Admin Home",
  });
};

exports.getAddEmployeePage = async (req, res) => {
  const result = await ticket.GetBranch();
  data = {
    dataFound: false,
    branch: result.result,
  };
  res.render("../views/admin/add_employee1.ejs", {
    data: data,
    title: "Add Employee",
    usertype: "admin",
    activepage: "Add Employee",
  });
};

exports.registerUser = async (req, res) => {
  const result = await staff.register(req.body);
  const branchR = await ticket.GetBranch();
  const data = {
    dataFound: false,
    branch: branchR.result,
  };

  if (result.validationError) {
    let obj = joiSupporter(result.validationError);
    obj.data = data;
    return res.status(400).render("../views/admin/add_employee1.ejs", obj);
  }
  if (result.connectionError) {
    return res.status(500).render("common/errorpage", {
      title: "Error",
      status: "500",
      message: "Internal Server Error",
    });
  }
  if (result.error) {
    return res.status(400).render("common/errorpage", {
      title: "Error",
      status: "400",
      message: "Bad Request",
    });
  }

  const cookieOption = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  res.redirect("/admin/addStaff");
};
