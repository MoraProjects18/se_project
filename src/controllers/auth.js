const jwt = require("jsonwebtoken");
const fileReader = require("../utils/file-reader");
const path = require("path");
const Email = require("../utils/email");
const config = require("config");
const User = require("../models/user");
const user = new User();

exports.registerUser = async (req, res) => {
  const result = await user.register(req.body);
  if (result.validationError)
    return res.status(400).send(result.validationError);
  if (result.connectionError)
    return res.status(500).send("Internal Server Error!");
  if (result.error) return res.status(400).send("Bad Request!");

  const cookieOption = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  const payload = result.userData;
  const token = jwt.sign(
    JSON.parse(JSON.stringify(payload)),
    config.get("jwtPrivateKey")
  );

  res
    .cookie("ets-auth-token", token, cookieOption)
    .status(200)
    .send("Query Inserted!");

  try {
    const htmlContent = await fileReader(
      path.join(__dirname, "../views/test.txt")
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
};


