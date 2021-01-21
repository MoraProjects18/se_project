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
const config = require("config");

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
    return res.status(500).send("Internal Server Error!");
  if (result.error) return res.status(400).send("Bad Request!");

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
    return res.status(400).send(result.validationError);

  if (result.connectionError)
    return res.status(500).send("Internal Server Error!");

  if (result.error) return res.status(400).send("Bad request!");

  if (result.repeatingRequest)
    return res.status(400).send("You have already confirmed email!");

  if (result.notValid) return res.status(406).send("Data is not acceptable!");

  res.status(200).redirect("/auth/login");
};

exports.showProfile = async (req, res) => {
  const result = await customer.show_profile(1); // user_id has to be given as parameter. It has to be fetched from token.
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

  res.render("../views/customer/customer_profile.ejs", {
    customer: result.result[0][0],
    customer1: result.result[1][0],
  });
};

exports.editProfile = async (req, res) => {
  console.log(req.body);
  const result = await customer.edit_profile(req.body, 1);
  if (result.validationError)
    return res.status(400).send(result.validationError);
  if (result.connectionError)
    return res.status(500).send("Internal Server Error!");
  if (result.error) return res.status(400).send("Bad Request!");
  res.status(200).send("Query is inserted!");
};

exports.changePass = async (req, res) => {
  // console.log(req.body);
  const result = await customer.change_pass(req.body, 1);
  console.log(result);
  if (result == "Incorrect Password")
    return res.status(200).send("Incorrect password");
  if (result.validationError)
    return res.status(400).send(result.validationError);
  if (result.connectionError)
    return res.status(500).send("Internal Server Error!");
  if (result.error) return res.status(400).send("Bad Request!");
  res.status(200).send("Query is inserted!");
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
