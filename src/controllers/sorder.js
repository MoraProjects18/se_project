const ejs = require("ejs");
const ServiceOrder = require("../models/serviceorder");
const sorder = new ServiceOrder();


exports.initiateSO = async (req, res) => {
console.log("444");
console.log(req.body);
  const result = await sorder.Initiate(req.body);
  console.log(result);
  if (result.validationError)
    return res.status(400).send(result.validationError);
  if (result.connectionError)
    return res.status(500).send("Internal Server Error!");
  if (result.error) return res.status(400).send("Bad Request!");
  res.status(200).send("Service Order Initiated..");
};
