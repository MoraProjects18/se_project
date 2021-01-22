const ejs = require("ejs");
const Email = require("../utils/email");
const Invoice = require("../models/invoice.js");
const ServiceOrder = require("../models/serviceorder.js");
const path = require("path");
const invoiceModel = new Invoice();
const SOModel = new ServiceOrder();

exports.home = async (req, res) => {
  res.render("./common/staff_home_page.ejs", {
    usertype: "cashier",
    activepage: "Home",
    title: "cashier home",
  });
};

exports.getInvoicePage = async (req, res) => {
  data = {
    dataFound: false,
  };
  res.render("./cashier/payment.ejs", data);
};

exports.searchInvoice = async (req, res) => {
  const invoiceR = await invoiceModel.getInvoice(req.body);
  if (invoiceR.validationError) {
    data = {
      error: {
        message: invoiceR.validationError.error.message,
      },
      value: invoiceR.validationError.value,
    };
    // return res.status(400).send(invoiceR.validationError);
    return res.status(400).render("./cashier/payment.ejs", data);
  }

  if (invoiceR.connectionError)
    return res.status(500).render("common/errorpage", {
      title: "Error",
      status: "500",
      message: "Internal Server Error",
    });
  if (invoiceR.error) return res.status(400).send("Bad Request!");

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
  res.status(200).render("./cashier/payment.ejs", data);
};

exports.payInvoice = async (req, res) => {
  const data = req.body;
  const result = await SOModel.paySO(data);
  if (result.validationError)
    return res.status(400).send(result.validationError);
  if (result.connectionError)
    return res.status(500).render("common/errorpage", {
      title: "Error",
      status: "500",
      message: "Internal Server Error",
    });
  if (result.error)
    return res.status(400).render("common/errorpage", {
      title: "Error",
      status: "400",
      message: "Bad Request",
    });
  res.status(200).send({ message: "Payment Confirmed" });
  const SOUser = await invoiceModel.getSOUser(data.service_order_id);
  // const email = new Email();
  // await email.send(
  //   soUser.result[0].email,
  //   `${soUser.result[0].service_order_id} payment details`,
  //   ``,
  //   `<h2>${soUser.result[0].service_order_id} service order's payment is sucessfull.</h2>`
  // );
  const htmlContent = await ejs.renderFile(
    path.join(__dirname, "../views/cashier/payment_confirmation_email.ejs"),
    {
      invoicedata: {
        first_name: SOUser.result[0].first_name,
        last_name: SOUser.result[0].last_name,
        date: SOUser.result[0].start_date,
        NIC: SOUser.result[0].NIC,
        service_order_id: SOUser.result[0].service_order_id,
        registration_number: SOUser.result[0].vehicle_number,
      },
    }
  );
  const email = new Email();
  const temp = await email.send(
    SOUser.result[0].email,
    "Service Order - Payment",
    "",
    htmlContent
  );
};

exports.closeServiceOrder = async (req, res) => {
  const data = req.body;
  const result = await SOModel.Close(data);
  if (result.validationError)
    return res.status(400).send(result.validationError);
  if (result.connectionError)
    return res.status(500).render("common/errorpage", {
      title: "Error",
      status: "500",
      message: "Internal Server Error",
    });
  if (result.error)
    return res.status(400).render("common/errorpage", {
      title: "Error",
      status: "400",
      message: "Bad Request",
    });
  res.status(200).send({ message: "Service Order Closed" });
};

exports.createInvoice = async (req, res) => {
  const result = await invoiceModel.createInvoice(req.body);
  if (result.validationError)
    return res.status(400).send(result.validationError);
  if (result.connectionError)
    return res.status(500).render("common/errorpage", {
      title: "Error",
      status: "500",
      message: "Internal Server Error",
    });
  if (result.error)
    return res.status(500).render("common/errorpage", {
      title: "Error",
      status: "400",
      message: "Bad Request",
    });
  res.status(200).send("New invoice is added!");
};
