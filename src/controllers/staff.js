const jwt = require("jsonwebtoken");
const path = require("path");
const config = require("config");
const User = require("../models/user");
const user = new User();

exports.showProfile = async (req, res) => {
    const result = await user.show_profile(req.body);
    if (result.validationError)
      return res.status(400).send(result.validationError);
    if (result.connectionError)
      return res.status(500).send("Internal Server Error!");
    if (result.error) return res.status(400).send("Bad Request!");
  
    const cookieOption = {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };
  
    const payload = result.userData;
    const token = jwt.sign(
      JSON.parse(JSON.stringify(payload)),
      config.get("jwtPrivateKey")
    );
  
    // res
    //   .cookie("ets-auth-token", token, cookieOption)
    //   .status(200)
    //   .send(result);
    res.render("../views/staff/staff_profile.ejs",{user: result[0]})
  
  };