const fileReader = require("../utils/file-reader");
const path = require("path");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const Email = require("../utils/email");
const Customer = require("../models/customer");
const customer = new Customer();


exports.home = async (req, res) => { 
  res.render("./common/customer_home_page.ejs", { usertype: "customer", activepage: "Home" ,title:"customer home"});
};



exports.registerUser = async (req, res) => {
  const result = await customer.register(req.body);
  if (result.validationError)
    return res.status(400).send(result.validationError);
  if (result.connectionError)
    return res.status(500).send("Internal Server Error!");
  if (result.error) return res.status(400).send("Bad Request!");

  res.status(200).send("Query Inserted!");

  try {
    const htmlContent = await fileReader(
      path.join(__dirname, "../views/test.txt")
    );

    const salt = await bcrypt.genSalt(10);
    const encryptedUserID = await bcrypt.hash(
      `${result.userData["user_id"]}`,
      salt
    );

    htmlContent.data = _.replace(
      htmlContent.data,
      "temp",
      `${result.userData["email"]}-${encryptedUserID}`
    );
    const email = new Email();
    await email.send(
      req.body.email,
      "ETC - Email Confirmation",
      "",
      htmlContent.data
    );
  } catch (ex) {
    console.log(ex);
  }

  //res.redirect("login page url");
};

exports.confirmMail = async (req, res) => {
  if (!req.cookies["ets-auth-token"]["email_verification"]) {
    const result = await customer.verifyEmail(req.params.email, req.query.id);

    if (result.validationError)
      return res.status(400).send(result.validationError);

    if (result.connectionError)
      return res.status(500).send("Internal Server Error!");

    if (result.error) return res.status(400).send("Bad request!");

    if (result.repeatingRequest)
      return res.status(400).send("You have already confirmed email!");

    if (result.notValid) return res.status(406).send("Data is not acceptable!");

    res.status(200).send("email confirmed");
    //res.redirect("home page usrl");
  } else {
    res.status(400).send("You have already confirmed the email address!");
  }
};
