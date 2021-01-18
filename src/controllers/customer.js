const jwt = require("jsonwebtoken");
const path = require("path");
const config = require("config");
const Customer = require("../models/customer");
const customer = new Customer();

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
    
    res.render("../views/customer/customer_profile.ejs",{customer: result.result[0][0], customer1: result.result[1][0]})
  
  };

  exports.editProfile = async (req,res) => {
    console.log(req.body);
    const result = await customer.edit_profile(req.body);
    if (result.validationError)
        return res.status(400).send(result.validationError);
    if (result.connectionError)
        return res.status(500).send("Internal Server Error!");
    if (result.error) return res.status(400).send("Bad Request!");
    res.status(200).send("Query is inserted!");
  };

  exports.changePass = async (req,res) => {
    // console.log(req.body);
    const result = await customer.change_pass(req.body);
    console.log(result);
    if (result== "Incorrect Password")
        return res.status(200).send("Incorrect password");
    if (result.validationError)
        return res.status(400).send(result.validationError);
    if (result.connectionError)
        return res.status(500).send("Internal Server Error!");
    if (result.error) return res.status(400).send("Bad Request!");
    res.status(200).send("Query is inserted!");
  };