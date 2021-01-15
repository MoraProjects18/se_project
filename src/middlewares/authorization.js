const jwt = require("jsonwebtoken");
const config = require("config");

exports.tokenAuthorize = (req, res, next) => {
  const token = req.cookies["ets-auth-token"];
  if (!token) return res.status(401).send("Access Denied. No token provided");

  try {
    const payload = jwt.verify(token, config.get("jwtPrivateKey"));
    req.user = payload;
    next();
  } catch (ex) {
    res.status(400).send("Invalid token");
  }
};

exports.isCustomerRole = (req, res, next) => {
  if (req.user["user_type"] === "customer") {
    next();
  } else {
    res.status(403).send("Forbidden");
  }
};

exports.isStaffRole = (req, res, next) => {
  if (req.user["user_type"] === "staff") {
    next();
  } else {
    res.status(403).send("Forbidden");
  }
};

exports.isAdminRole = (req, res, next) => {
  if (req.user["user_type"] === "admin") {
    next();
  } else {
    res.status(403).send("Forbidden");
  }
};

exports.isEmailVerified = (req, res, next) => {
  if (req.user["email_verification"]) {
    next();
  } else {
    res.status(300).send("You have not verified your email yet!");
  }
};

exports.isAlreadyLogin = (req, res, next) => {
  if (req.user["email_verification"]) {
    next();
  } else {
    res.status(300).send("You have already logged in");
  }
};
