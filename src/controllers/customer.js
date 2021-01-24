const joiSupporter = require("../utils/joi-supporter");
const path = require("path");
const config = require("config");
const ejs = require("ejs");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const Email = require("../utils/email");
const Customer = require("../models/customer");
const customer = new Customer();
const jwt = require("jsonwebtoken");
const moment = require("moment");
const Ticket = require("../models/ticket.js");
const ticket = new Ticket();

exports.home = async (req, res) => {
  res.render("./common/customer_home_page.ejs", {
    usertype: "customer",
    activepage: "Home",
    title: "customer home",
  });
};

exports.registerUser = async (req, res) => {
  const result = await customer.register(req.body);
  if (result.validationError) {
    let obj = joiSupporter(result.validationError);
    return res.status(400).render("common/register", obj);
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

  try {
    const salt = await bcrypt.genSalt(10);
    const encryptedUserID = await bcrypt.hash(
      `${result.userData["user_id"]}`,
      salt
    );

    const htmlContent = await ejs.renderFile(
      path.join(__dirname, "../views/email/email.ejs"),
      {
        siteName: config.get("site_name"),
        email: result.userData["email"],
        id: encryptedUserID,
      }
    );

    const email = new Email();
    await email.send(
      req.body.email,
      "ETC - Email Confirmation",
      "",
      htmlContent
    );
  } catch (ex) {
    console.log(ex);
  }

  res.status(200).redirect("/auth/login");
};

exports.getRegisterPage = (req, res) => {
  res.status(200).render("common/register");
};

exports.confirmMail = async (req, res) => {
  const result = await customer.verifyEmail(req.params.email, req.query.id);

  if (result.validationError)
    return res.status(400).render("common/errorpage", {
      title: "Error",
      status: "400",
      message: "Indentification details are incorrect",
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

  if (result.repeatingRequest)
    return res.status(400).render("common/errorpage", {
      title: "Error",
      status: "400",
      message: "You have already confirm the email",
    });

  if (result.notValid)
    return res.status(406).render("common/errorpage", {
      title: "Error",
      status: "406",
      message: "Data is not acceptable",
    });

  res.status(200).redirect("/auth/login");
};

exports.showProfile = async (req, res) => {
  const result = await customer.show_profile(req["user"]["user_id"]); // user_id has to be given as parameter. It has to be fetched from token.
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
  res.render("../views/customer/customer_profile.ejs", {
    customer: result.result[0][0],
    customer1: result.result[1][0],
    usertype: user_type,
  });
};

exports.editProfile = async (req, res) => {
  const result = await customer.edit_profile(req.body, req["user"]["user_id"]);
  if (result.validationError) {
    let obj = joiSupporter(result.validationError);
    const data = await customer.show_profile(req["user"]["user_id"]);
    obj.customer = data.result[0][0];
    obj.customer1 = data.result[1][0];
    obj.usertype = req.user.user_type;
    return res
      .status(400)
      .render("../views/customer/customer_profile.ejs", obj);
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
  const user_type = req.user.user_type.toLowerCase();
  res.status(200).redirect(`/${user_type}/profile`);
};

exports.changePass = async (req, res) => {
  const result = await customer.change_pass(req.body, req["user"]["user_id"]);

  if (result.current_password_error) {
    const data = await customer.show_profile(req["user"]["user_id"]);
    let obj = {
      customer: data.result[0][0],
      customer1: data.result[1][0],
      usertype: req.user.user_type,
      current_password_error: true,
    };
    return res
      .status(400)
      .render("../views/customer/customer_profile.ejs", obj);
  }

  if (result.validationError) {
    let obj = joiSupporter(result.validationError);
    const data = await customer.show_profile(req["user"]["user_id"]);
    obj.customer = data.result[0][0];
    obj.customer1 = data.result[1][0];
    obj.usertype = req.user.user_type;
    return res
      .status(400)
      .render("../views/customer/customer_profile.ejs", obj);
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

exports.getTicketPage = async (req, res) => {
  var result = await ticket.GetBranch();

  if (result.connectionError)
    return res.status(500).send("Internal Server Error!");
  if (result.error) return res.status(400).send("Bad Request!");

  data = {
    dataFound: false,
    branch: result.result,
    usertype: "customer",
    activepage: "Create Ticket",
    title: "Create Ticket",
  };

  res.render("../views/ticket/createTicket.ejs", data);
};

exports.getUserTicket = async (req, res) => {
  const user_id = req.user.user_id;
  const result = await ticket.UserTicket(user_id);

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
  if (result.resultData != 0) {
    var strng = JSON.stringify(result.resultData);
    var mydata = JSON.parse(strng);

    data = {
      dataFound: true,
      ticket: mydata,
      usertype: "customer",
      activepage: "Ticket details",
      title: "Tickets Details",
      moment: moment,
    };
  } else {
    data = {
      dataFound: false,
      usertype: "customer",
      activepage: "Ticket details",
      title: "Tickets Details",
      moment: moment,
      error: {
        status: false,
        message: "No data to show",
      },
    };
  }

  res.render("./ticket/viewTicketTable.ejs", data);
};

exports.cancelTicket = async (req, res) => {
  const data = req.body;

  const result = await ticket.Close(data.ticket_id);
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
  res.status(200).redirect(`/customer/ticketDetails`);
};
