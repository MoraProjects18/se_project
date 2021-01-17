const joiSupporter = require("../utils/joi-supporter");
const path = require("path");
const config = require("config");
const ejs = require("ejs");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const Email = require("../utils/email");
const Customer = require("../models/customer");
const customer = new Customer();

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
