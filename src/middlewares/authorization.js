const jwt = require("jsonwebtoken");
const config = require("config");

exports.tokenAuthorize = (req, res, next) => {
  const token = req.cookies["ets-auth-token"];
  if (!token)
    return res.status(401).render("common/errorpage", {
      title: "Error",
      status: "401",
      message: "Access Denied. No token provided",
    });

  try {
    const payload = jwt.verify(token, config.get("jwtPrivateKey"));
    req.user = payload;
    next();
  } catch (ex) {
    res.status(400).render("common/errorpage", {
      title: "Error",
      status: "400",
      message: "Invalid token",
    });
  }
};

exports.isCustomerRole = (req, res, next) => {
  if (req.user["user_type"] === "customer") {
    next();
  } else {
    res.status(403).render("common/errorpage", {
      title: "Error",
      status: "403",
      message: "Forbidden",
    });
  }
};

exports.isStaffRole = (req, res, next) => {
  if (req.user["user_type"] === "staff") {
    next();
  } else {
    res.status(403).render("common/errorpage", {
      title: "Error",
      status: "403",
      message: "Forbidden",
    });
  }
};

exports.isCashierfRole = (req, res, next) => {
  if (req.user["user_type"] === "cashier") {
    next();
  } else {
    res.status(403).render("common/errorpage", {
      title: "Error",
      status: "403",
      message: "Forbidden",
    });
  }
};

exports.isReceptionistsfRole = (req, res, next) => {
  if (req.user["user_type"] === "receptionist") {
    next();
  } else {
    res.status(403).render("common/errorpage", {
      title: "Error",
      status: "403",
      message: "Forbidden",
    });
  }
};

exports.isReportIssuerfRole = (req, res, next) => {
  if (req.user["user_type"] === "reportIssuer") {
    next();
  } else {
    res.status(403).render("common/errorpage", {
      title: "Error",
      status: "403",
      message: "Forbidden",
    });
  }
};

exports.isAdminRole = (req, res, next) => {
  if (req.user["user_type"] === "admin") {
    next();
  } else {
    res.status(403).render("common/errorpage", {
      title: "Error",
      status: "403",
      message: "Forbidden",
    });
  }
};

exports.isEmailVerified = (req, res, next) => {
  if (req.user["email_verification"]) {
    next();
  } else {
    res.status(400).render("common/errorpage", {
      title: "Error",
      status: "400",
      message: "You didn't confirm the email yet.",
    });
  }
};

exports.isAlreadyLogin = (req, res, next) => {
  if (!req.cookies["ets-auth-token"]) {
    next();
  } else {
    res.status(400).render("common/errorpage", {
      title: "Error",
      status: "400",
      message: "You have already logged in",
    });
  }
};
