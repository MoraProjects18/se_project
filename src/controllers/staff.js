const jwt = require("jsonwebtoken");
const path = require("path");
const config = require("config");
const Staff = require("../models/staff");
const { tokenAuthorize } = require("../middlewares/authorization");
const staff = new Staff();

exports.showProfile = async (req, res) => {
  const result = await staff.show_profile(req["user"]["user_id"]); // user_id has to be given as parameter. It has to be fetched from token.
  if (result.validationError)
    return res.status(400).send(result.validationError);
  if (result.connectionError)
    return res.status(500).send("Internal Server Error!");
  if (result.error) return res.status(400).send("Bad Request!");

  const cookieOption = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  // const payload = result.userData;
  // const token = jwt.sign(
  //   JSON.parse(JSON.stringify(payload)),
  //   config.get("jwtPrivateKey")
  // );

  // res
  //   .cookie("ets-auth-token", token, cookieOption)
  //   .status(200)
  //   .send(result);
  //  console.log(result.result[0][0]);
  const user_type = req.user.user_type.toLowerCase();
  res.render("../views/staff/staff_profile.ejs", {
    staff: result.result[0][0],
    staff1: result.result[1][0],
    usertype: user_type,
  });
};

exports.editProfile = async (req, res) => {
  const result = await staff.edit_profile(req.body, req["user"]["user_id"]);
  if (result.validationError)
    return res.status(400).send(result.validationError);
  if (result.connectionError)
    return res.status(500).send("Internal Server Error!");
  if (result.error) return res.status(400).send("Bad Request!");
  const user_type = req.user.user_type.toLowerCase();
  res.status(200).redirect(`/${user_type}/profile`);
};

exports.changePass = async (req, res) => {
  // console.log(req.body);
  const result = await staff.change_pass(req.body, req["user"]["user_id"]);
  if (result == "Incorrect Password")
    return res.status(200).send("Incorrect password");
  if (result.validationError)
    return res.status(400).send(result.validationError);
  if (result.connectionError)
    return res.status(500).send("Internal Server Error!");
  if (result.error) return res.status(400).send("Bad Request!");
  const user_type = req.user.user_type.toLowerCase();
  res.status(200).redirect(`/${user_type}/profile`);
};
