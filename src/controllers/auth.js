const User = require("../models/user");
const user = new User();

exports.registerUser = async (req, res) => {
  const result = await user.register(req.body);
  if (result.validationError)
    return res.status(400).send(result.validationError);
  if (result.connectionError)
    return res.status(500).send("Internal Server Error!");
  if (result.error) return res.status(400).send("Bad Request!");
  res.status(200).send("Query is inserted!");
};
