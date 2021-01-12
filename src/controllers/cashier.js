const ejs = require("ejs");
const Invoice = require("../models/invoice.js");
const invoice = new Invoice();

exports.getInvoice = async (req, res) => {
  data = {
    dataFound: false,
  };
  res.render("./cashier/payment.ejs", data);
};

exports.payInvoice = async (req, res) => {
  const invoice_id = await invoice.getInvoice(req.body);
};

exports.createInvoice = async (req, res) => {
  const result = await invoice.createInvoice(req.body);
  if (result.validationError)
    return res.status(400).send(result.validationError);
  if (result.connectionError)
    return res.status(500).send("Internal Server Error!");
  if (result.error) return res.status(400).send("Bad Request!");
  res.status(200).send("New invoice is added!");
};
