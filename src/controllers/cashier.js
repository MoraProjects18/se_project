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
  const invoice = await invoiceModel.getInvoice(req.body);
  // const service_order = await serviceOrderModel.getServiceOrder(
  //   invoice.service_order_id
  // );
  // const user = await UserModel.findUser(service_order.user_id);

  // data = {
  //   invoice_id: invoice.invoice_id,
  //   NIC: user.NIC,
  //   service_order_id: service_order.id,
  //   vehicle_number: service_order.vehicle_number,
  //   start_date: service_order.start_date,
  //   end_date: service_order.end_date,
  //   first_name: user.first_name,
  //   last_name: user.last_name,
  // };
  console.log(invoice);
  data = {
    dataFound: true,
    invoice_id: 12313,
  };
  // res.render("./cashier/payment.ejs", data);
};

exports.payInvoice = async (req, res) => {};

exports.createInvoice = async (req, res) => {
  console.log(req.body);
  const result = await invoiceModel.createInvoice(req.body);
  if (result.validationError)
    return res.status(400).send(result.validationError);
  if (result.connectionError)
    return res.status(500).send("Internal Server Error!");
  if (result.error) return res.status(400).send("Bad Request!");
  res.status(200).send("New invoice is added!");
};
