const ejs = require("ejs");
const path = require("path");
const ServiceOrder = require("../models/serviceorder");
const Invoice = require("../models/invoice.js");
const Vehicle = require("../models/vehicle.js");
const sorder = new ServiceOrder();
const invoice = new Invoice();
const Email = require("../utils/email");
const config = require("config");
const vehicleModel = new Vehicle();

exports.getHomePage = async (req, res) => {
  res.render("./common/staff_home_page.ejs", {
    usertype: "receptionist",
    activepage: "Home",
    title: "Receptionist Home",
  });
};
exports.getinitiatePage = async (req, res) => {
  data = {
    dataFound: false,
    error: { status: false },
  };
  res.render("./receptionist/initiateso.ejs", data);
};

exports.getcontinuePage = async (req, res) => {
  data = {
    dataFound: false,
    error: { status: false },
  };
  res.render("./receptionist/continueso.ejs", data);
};

exports.getSearchPage = async (req, res) => {
  data = {
    dataFound: false,
    error: { status: false },
  };
  res.render("./receptionist/searchso.ejs", data);
};

exports.initiateSO = async (req, res) => {
  const result = await sorder.Initiate(req.body);
  if (result.validationError)
    return res.status(400).send(result.validationError.error.message);
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
  const received = JSON.parse(JSON.stringify(result.data));

  const SOUser = await invoice.getSOUser(received.service_order_id);
  const invoiceDetails = await invoice.getInvoice({
    invoice_id: received.invoice_id,
  });

  const htmlContent = await ejs.renderFile(
    path.join(__dirname, "../views/receptionist/email_invoice1.ejs"),
    {
      invoicedata: {
        invoice_id: received.invoice_id,
        first_name: SOUser.result[0].first_name,
        last_name: SOUser.result[0].last_name,
        date: SOUser.result[0].start_date,
        NIC: SOUser.result[0].NIC,
        service_order_id: SOUser.result[0].service_order_id,
        registration_number: SOUser.result[0].vehicle_number,
        amount: invoiceDetails.result[0].payment_amount,
      },
    }
  );

  const email = new Email();
  const temp = await email.send(
    SOUser.result[0].email,
    "Service Order - Invoice",
    "",
    htmlContent
  );
  res.status(200).send(received);
};

exports.continueSO = async (req, res) => {
  const result = await sorder.paySO(req.body);
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
  res
    .status(200)
    .send({ status: "success", message: "Service Order continued" });
};

exports.failedSO = async (req, res) => {
  const result = await sorder.GetCustomer(req.body);
  if (result.validationError) {
    data = {
      error: {
        status: true,
        message: result.validationError.error.message,
      },
      value: result.validationError.value,
    };
    return res.render("./receptionist/continueso.ejs", data);
  }
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

  if (result.resultData != 0) {
    var customerdata = JSON.parse(JSON.stringify(result.resultData[0]));
    if (customerdata.user_type == "customer") {
      const failed = await sorder.GetFailedSO(req.body);
      var faileddata = JSON.parse(JSON.stringify(failed.resultData));
      var available_so = [];
      for (var so of faileddata) {
        if (notExpired(so.start_date)) {
          available_so.push(so);
        }
      }
      data = {
        dataFound: true,
        error: { status: false },
        customer: customerdata,
        available: available_so,
      };
    } else {
      data = {
        dataFound: false,
        error: { status: true, message: "An staff User" },
      };
    }
  } else {
    data = {
      dataFound: false,
      error: {
        status: true,
        message: "No user available",
      },
    };
  }
  res.render("./receptionist/continueso.ejs", data);
};

exports.getbyidSO = async (req, res) => {
  const resultSO = await sorder.GetById(req.body);
  if (resultSO.validationError) {
    data = {
      error: { status: true, message: resultSO.validationError.error.message },
      value: resultSO.validationError.value,
    };
    return res.render("./receptionist/searchso.ejs", data);
  }
  if (resultSO.connectionError)
    return res.status(500).render("common/errorpage", {
      title: "Error",
      status: "500",
      message: "Internal Server Error",
    });
  if (resultSO.error)
    return res.status(400).render("common/errorpage", {
      title: "Error",
      status: "400",
      message: "Bad Request",
    });
  if (resultSO.resultData != 0) {
    var sodata = JSON.parse(JSON.stringify(resultSO.resultData[0]));
    const cust = await invoice.getSOUser(sodata.service_order_id);
    var customdata = JSON.parse(JSON.stringify(cust.result[0]));
    data = {
      dataFound: true,
      error: { status: false },
      customer: customdata,
      serviceorder: sodata,
    };
  } else {
    data = {
      dataFound: false,
      error: { status: true, message: "Invalid Service Order ID" },
    };
  }
  res.render("./receptionist/searchso.ejs", data);
};

exports.getmySO = async (req, res) => {
  const result = await sorder.GetMySO(req["user"]["user_id"]);
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
  if (result.resultData != 0) {
    var sodata = JSON.parse(JSON.stringify(result.resultData));
    data = {
      dataFound: true,
      sorder: sodata,
    };
  } else {
    data = {
      dataFound: false,
      error: {
        status: true,
        message: "No Any Service Order History",
      },
    };
  }
  res.render("./customer/getmyso.ejs", data);
};

exports.gettodaySO = async (req, res) => {
  const result = await sorder.TodaySO();
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

  if (result.resultData != 0) {
    var strng = JSON.stringify(result.resultData);
    var mydata = JSON.parse(strng);
    data = {
      dataFound: true,
      sorder: mydata,
    };
  } else {
    data = {
      dataFound: false,
      error: {
        status: false,
        message: "No any Service Orders opened yet",
      },
    };
  }
  res.render("./receptionist/todayso.ejs", data);
};

exports.getallData = async (req, res) => {
  const result = await sorder.GetCustomer(req.body);
  if (result.validationError) {
    data = {
      error: { status: true, message: result.validationError.error.message },
      value: result.validationError.value,
    };
    return res.render("./receptionist/initiateso.ejs", data);
  }
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

  if (result.resultData != 0) {
    var customerdata = JSON.parse(JSON.stringify(result.resultData[0]));
    if (customerdata.user_type == "customer") {
      const vehicle = await vehicleModel.GetVehicle(customerdata.user_id);
      var vehicledata = JSON.parse(JSON.stringify(vehicle.resultData));
      data = {
        dataFound: true,
        error: { status: false },
        customer: customerdata,
        vehicle: vehicledata,
      };
    } else {
      data = {
        dataFound: false,
        error: { status: true, message: "An staff User" },
      };
    }
  } else {
    data = {
      dataFound: false,
      error: { status: true, message: "No user available" },
    };
  }
  res.render("./receptionist/initiateso.ejs", data);
};

exports.postvehicle = async (req, res) => {
  const result = await vehicleModel.AddVehicle(req.body);
  if (result.validationError)
    return res.status(400).send(result.validationError.error.message);
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
  res
    .status(200)
    .send({ status: "success", message: "Vehicle Added successfully" });
};

function notExpired(date) {
  const max_days = 180; //6 months
  var start = new Date(date).getTime();
  var today = new Date().getTime();
  var difference = parseInt((today - start) / (1000 * 3600 * 24));
  if (max_days > difference) {
    return true;
  } else {
    return false;
  }
}
