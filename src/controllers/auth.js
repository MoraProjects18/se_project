const jwt = require("jsonwebtoken");
const config = require("config");
const User = require("../models/user");
const user = new User();

exports.login = async (req, res) => {
  const result = await user.login(req.body);

  if (result.validationError)
    return res.status(400).render("common/login.ejs", {
      alert: {
        type: "danger",
        msg: "Email is invalid. Enter a valid email address!",
      },
    });

  if (result.connectionError)
    return res.status(500).render("common/errorpage", {
      title: "Error",
      status: "500",
      message: "Internal Server Error",
    });

  if (!result.allowAccess)
    return res.status(401).render("common/login.ejs", {
      alert: {
        type: "danger",
        msg: "Access Denied! Unauthorized Client",
      },
    });

  const cookieOption = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  const payload = JSON.parse(JSON.stringify(result.tokenData));
  const token = jwt.sign(payload, config.get("jwtPrivateKey"));

  res
    .cookie("ets-auth-token", token, cookieOption)
    .status(200)
    .redirect(`/${result.tokenData["user_type"]}/home`);
};

exports.logout = (req, res) => {
  const cookieOption = {
    expires: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  res.cookie("ets-auth-token", "", cookieOption).status(200).redirect("/home/");
};

exports.getLoginPage = (req, res) => {
  res.status(200).render("common/login.ejs", {
    alert: false,
  });
};
