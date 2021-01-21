const ejs = require("ejs");
const Email = require("../utils/email");
const Invoice = require("../models/invoice.js");
const ServiceOrder = require("../models/serviceorder.js");
const invoiceModel = new Invoice();
const SOModel = new ServiceOrder();

// const ServiceOrder = require("../models/serviceOrder.js");
// const serviceOrderModel = new ServiceOrder();
// const User = require("../models/user.js");
// const userModel = new User();


exports.home = async (req, res) => { 
  res.render("./common/staff_home_page.ejs", { usertype: "cashier", activepage: "Home",title:"customer home"});
};


exports.getInvoicePage = async (req, res) => {
  data = {
    dataFound: false,
  };
  res.render("./cashier/payment.ejs", data);
};

exports.searchInvoice = async (req, res) => {
  const invoiceR = await invoiceModel.getInvoice(req.body);
//console.log(invoiceR);
  if (invoiceR.validationError) {
    data = {
      error: {
        message: invoiceR.validationError.error.message,
      },
      value: invoiceR.validationError.value,
    };
    // return res.status(400).send(invoiceR.validationError);
    return res.render("./cashier/payment.ejs", data);
  }

  if (invoiceR.connectionError)
    return res.status(500).send("Internal Server Error!");
  if (invoiceR.error) return res.status(400).send("Bad Request!");
  // res.status(200).send("Payment Confirmed");

  if (invoiceR.result.length != 0) {
    const invoice = invoiceR.result[0];
    const service_order_id = invoice.service_order_id;
    const soUser = await invoiceModel.getSOUser(service_order_id);
    const sou = soUser.result[0];

    data = {
      dataFound: true,
      invoice_id: invoice.invoice_id,
      NIC: sou.NIC,
      service_order_id: invoice.service_order_id,
      vehicle_number: sou.vehicle_number,
      start_date: sou.start_date,
      end_date: sou.end_date,
      first_name: sou.first_name,
      last_name: sou.last_name,
      status: sou.status,
      payment_amount: invoice.payment_amount,
    };
  } else {
    data = {
      dataFound: false,
      error: {
        status: false,
        message: "Invalid invoice number",
      },
    };
  }
  console.log(data);
  res.render("./cashier/payment.ejs", data);
};

exports.payInvoice = async (req, res) => {
  const data = req.body;
  // const result = await SOModel.paySO(data);
  const result = true;
  if (result.validationError)
    return res.status(400).send(result.validationError);
  if (result.connectionError)
    return res.status(500).send({ message: "Internal Server Error!" });
  if (result.error) return res.status(400).send();
  res.status(200).send({ message: "Payment Confirmed" });

  const soUser = await invoiceModel.getSOUser(data.service_order_id);
  console.log(soUser);
  const email = new Email();
  await email.send(
    soUser.email,
    `${soUser.service_order_id} payment details`,
    `Payment of ${soUser.service_order_id} is confirmed`
  );
};

exports.closeServiceOrder = async (req, res) => {
  const data = req.body;
  const result = await SOModel.Close(data);
  if (result.validationError)
    return res.status(400).send(result.validationError);
  if (result.connectionError)
    return res.status(500).send({ message: "Internal Server Error!" });
  if (result.error) return res.status(400).send({ message: "Bad Request!" });
  res.status(200).send({ message: "Service Order Closed" });
};

exports.createInvoice = async (req, res) => {
  const result = await invoiceModel.createInvoice(req.body);
  if (result.validationError)
    return res.status(400).send(result.validationError);
  if (result.connectionError)
    return res.status(500).send("Internal Server Error!");
  if (result.error) return res.status(400).send("Bad Request!");
  res.status(200).send("New invoice is added!");
};
