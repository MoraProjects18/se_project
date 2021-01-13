const ejs = require("ejs");
const Invoice = require("../models/invoice.js");
const invoiceModel = new Invoice();

// const ServiceOrder = require("../models/serviceOrder.js");
// const serviceOrderModel = new ServiceOrder();

// const User = require("../models/user.js");
// const userModel = new User();

exports.getInvoicePage = async (req, res) => {
  data = {
    dataFound: false,
  };

  res.render("./cashier/payment.ejs", data);
};

exports.searchInvoice = async (req, res) => {
  const invoiceR = await invoiceModel.getInvoice(req.body);
  const invoice = invoiceR.result[0];
  if (invoice.length != 0) {
    const service_order_id = invoice.service_order_id;
    const soUser = await invoiceModel.getSOUser(service_order_id);

    const sou = soUser.result[0];

    data = {
      invoice_id: invoice.invoice_id,
      NIC: sou.NIC,
      service_order_id: invoice.service_order_id,
      vehicle_number: sou.vehicle_number,
      start_date: sou.start_date,
      end_date: sou.end_date,
      first_name: sou.first_name,
      last_name: sou.last_name,
      status: sou.status,
    };
  } else {
    data = {
      dataFound: false,
      error: invoiceR.error,
    };
  }
  res.render("./cashier/payment.ejs", data);
};

exports.payInvoice = async (req, res) => {};

exports.createInvoice = async (req, res) => {
  const result = await invoiceModel.createInvoice(req.body);
  if (result.validationError)
    return res.status(400).send(result.validationError);
  if (result.connectionError)
    return res.status(500).send("Internal Server Error!");
  if (result.error) return res.status(400).send("Bad Request!");
  res.status(200).send("New invoice is added!");
};
