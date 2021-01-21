const jwt = require("jsonwebtoken");
const path = require("path");
const Email = require("../utils/email");
const config = require("config");
const Staff = require("../models/staff");
const staff = new Staff();

exports.getAddEmployeePage = async (req, res) => {
  data = {
    dataFound: false,
  };
  res.render("../views/admin/add_employee1.ejs", data);
};

exports.registerUser = async (req, res) => {
  console.log(req.body);
  const result = await staff.register(req.body);
  if (result.validationError)
    return res.status(400).send(result.validationError);
  if (result.connectionError)
    return res.status(500).send("Internal Server Error!");
  if (result.error) return res.status(400).send("Bad Request!");

  const cookieOption = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  //   const payload = result.userData;
  //   const token = jwt.sign(
  //     JSON.parse(JSON.stringify(payload)),
  //     config.get("jwtPrivateKey")
  //   );

  //   res
  //     .cookie("ets-auth-token", token, cookieOption)
  //     .status(200)
  //     .send("Query Inserted!");
  res.status(200).send("Query inserted");
};
