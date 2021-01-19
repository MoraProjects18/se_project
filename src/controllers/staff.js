const jwt = require("jsonwebtoken");
const path = require("path");
const config = require("config");
const Staff = require("../models/staff");
const staff = new Staff();

exports.showProfile = async (req, res) => {
    const result = await staff.show_profile(6); // user_id has to be given as parameter. It has to be fetched from token.
    if (result.validationError)
      return res.status(400).send(result.validationError);
    if (result.connectionError)
      return res.status(500).send("Internal Server Error!");
    if (result.error) return res.status(400).send("Bad Request!");
  
    // const cookieOption = {
    //   expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    //   httpOnly: true,
    // };
  
    // const payload = result.userData;
    // const token = jwt.sign(
    //   JSON.parse(JSON.stringify(payload)),
    //   config.get("jwtPrivateKey")
    // );
  
    // res
    //   .cookie("ets-auth-token", token, cookieOption)
    //   .status(200)
    //   .send(result);
     console.log(result.result[0][0]);
    res.render("../views/staff/staff_profile.ejs",{staff: result.result[0][0], staff1: result.result[1][0]})
  };

  exports.editProfile = async (req,res) => {
    console.log(req.body);
    const result = await staff.edit_profile(req.body,6);
    if (result.validationError)
        return res.status(400).send(result.validationError);
    if (result.connectionError)
        return res.status(500).send("Internal Server Error!");
    if (result.error) return res.status(400).send("Bad Request!");
    res.status(200).send("Query is inserted!");
  };

  exports.changePass = async (req,res) => {
    console.log(req.body);
    const result = await staff.change_pass(req.body,6);
    if (result== "Incorrect Password")
        return res.status(200).send("Incorrect password");
    if (result.validationError)
        return res.status(400).send(result.validationError);
    if (result.connectionError)
        return res.status(500).send("Internal Server Error!");
    if (result.error) return res.status(400).send("Bad Request!");
    res.status(200).send("Query is inserted!");
  };