const jwt = require("jsonwebtoken");
const path = require("path");
const config = require("config");
const joiSupporter = require("../utils/joi-supporter");
const Staff = require("../models/staff");
const { tokenAuthorize } = require("../middlewares/authorization");
const staff = new Staff();

exports.showProfile = async (req, res) => {
  // user_id has to be given as parameter. It has to be fetched from token.
  const result = await staff.show_profile(req["user"]["user_id"]);
  if (result.validationError)
    return res.status(400).render("common/errorpage", {
      title: "Error",
      status: "400",
      message: "Invalid Credentials",
    });
  if (result.connectionError)
    return res.status(500).render("common/errorpage", {
      title: "Error",
      status: "500",
      message: "Internal Server Error",
    });
  if (result.error)
    return res.status(400).render("common/errorpage", {
      title: "Error",
      status: "400",
      message: "Bad Request",
    });

  const user_type = req.user.user_type.toLowerCase();
  res.render("staff/staff_profile", {
    staff: result.result[0][0],
    staff1: result.result[1][0],
    usertype: user_type,
    // current_password_error: true,
    // error: {
    //   first_name: "Hey there",
    // },
    // value: {
    //   first_name: "gooo",
    // },
  });
};

exports.editProfile = async (req, res) => {
  const result = await staff.edit_profile(req.body, req["user"]["user_id"]);

  if (result.validationError) {
    let obj = joiSupporter(result.validationError);
    const data = await staff.show_profile(req["user"]["user_id"]);
    obj.staff = data.result[0][0];
    obj.staff1 = data.result[1][0];
    obj.usertype = req.user.user_type;
    return res.status(400).render("staff/staff_profile", obj);
  }
  if (result.connectionError)
    return res.status(500).render("common/errorpage", {
      title: "Error",
      status: "500",
      message: "Internal Server Error",
    });
  if (result.error)
    return res.status(400).render("common/errorpage", {
      title: "Error",
      status: "400",
      message: "Bad Request",
    });

  const user_type = req.user.user_type.toLowerCase();
  res.status(200).redirect(`/${user_type}/profile`);
};

exports.changePass = async (req, res) => {
  const result = await staff.change_pass(req.body, req["user"]["user_id"]);

  if (result.current_password_error) {
    const data = await staff.show_profile(req["user"]["user_id"]);
    let obj = {
      staff: data.result[0][0],
      staff1: data.result[1][0],
      usertype: req.user.user_type,
      current_password_error: true,
    };
    return res.status(400).render("staff/staff_profile", obj);
  }
  if (result.validationError) {
    let obj = joiSupporter(result.validationError);
    const data = await staff.show_profile(req["user"]["user_id"]);
    obj.staff = data.result[0][0];
    obj.staff1 = data.result[1][0];
    obj.usertype = req.user.user_type;
    return res.status(400).render("staff/staff_profile", obj);
  }
  if (result.connectionError)
    return res.status(500).render("common/errorpage", {
      title: "Error",
      status: "500",
      message: "Internal Server Error",
    });
  if (result.error)
    return res.status(400).render("common/errorpage", {
      title: "Error",
      status: "400",
      message: "Bad request",
    });
  const user_type = req.user.user_type.toLowerCase();
  res.status(200).redirect(`/${user_type}/profile`);
};
