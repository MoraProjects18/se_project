const jwt = require("jsonwebtoken");
const config = require("config");
const User = require("../models/user");
const user = new User();

exports.login = async (req, res) => {
  const result = await user.login(req.body);

  if (result.validationError)
    return res.status(400).send(result.validationError);

  if (result.connectionError)
    return res.status(500).send("Internal Server Error!");

  if (!result.allowAccess) return res.status(401).send("Unauthorized client");

  const cookieOption = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  const payload = JSON.parse(JSON.stringify(result.tokenData));
  const token = jwt.sign(payload, config.get("jwtPrivateKey"));

  res
    .cookie("ets-auth-token", token, cookieOption)
    .status(200)
    .send("Login successfull!");

  //res.redirect("home page url");
};
