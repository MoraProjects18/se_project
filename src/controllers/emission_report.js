const express = require("express");
const router = express.Router();
let ejs = require("ejs");

const Report = require("../models/report");
const report = new Report();

let settings = { method: "Get" };
exports.getreportPage = async (req, res) => {
  //console.log("here");
  const service_order = await report.get_SO_details();

  var moment = require("moment");

  var serviceorders = service_order.result;
  console.log(serviceorders);
  res.render("./reportissuer/EmissionReport.ejs", {
    name: "charuka",
    serviceorders: serviceorders,
    moment: moment,
    title: "Emission Report",
    usertype: "reportissuer",
    activepage: "Issue Report",
  });
};

/*
exports.getjson= async (req, res) => {
    res.json(
            {"body":
                {"1":
                    {"vehicle number":'km4567',"test_status":"Passed","Engine number":"456",
                        "Test1":{"Carbon":"0.89","CO2":"0.87","CO":"0.14","O2":'0.31'},
                        "Test2":{"Carbon":"0.77","CO2":"0.67","CO":"0.34","O2":'0.21'},
                    }
                }
            }
            );
  };
*/

exports.getreporthtml = async (req, res) => {
  var SO_id = req.params.id;
  const so_result = await report.get_SO(SO_id);
  //console.log(so_result.result[0]);

  var test_resu = await report.get_test(SO_id);
  //console.log(test_resu.error);

  if (test_resu.length != 0 && !test_resu.error) {
    res.render("./reportissuer/template.ejs", {
      reportdata: test_resu,
      SO_id: SO_id,
      so_data: so_result,
      test_completed: "yes",
    });
  } else if (test_resu.error) {
    res.render("./common/errorpage.ejs", {
      title: "Emission Report Error",
      status: 502,
      message: "Emission report database not connected!",
    });
  } else {
    res.render("./common/errorpage.ejs", {
      title: "Emission Report Error",
      status: 400,
      message: "Emission Test is not completed!",
    });
  }
};

exports.getreportpdf = async (req, res) => {
  var SO_id = req.params.id;
  var test_resu = await report.get_test(SO_id);
  //console.log(test_resu);
  if (test_resu.length != 0 && !test_resu.error) {
    var pdf = await report.get_report_pdf(SO_id);
    if (test_resu.test_status == 1) {
      var state_test = "Closed";
    } else {
      var state_test = "Failed";
    }
    var update_so = await report.update_so_state(SO_id, state_test);
    res.contentType("application/pdf");
    res.send(pdf);
  } else if (test_resu.error) {
    res.render("./common/errorpage.ejs", {
      title: "Emission Report Error",
      status: 502,
      message: "Emission report database not connected!",
    });
  } else {
    res.render("./common/errorpage.ejs", {
      title: "Emission Report Error",
      status: 400,
      message: "Emission Test is not completed!",
    });
  }
};

exports.postreport = async (req, res) => {
  var SO_id = req.body["SO_id"];

  var pdfurl = "/reportissuer/get_report/" + SO_id + "/pdf";
  res.redirect(pdfurl);
};

exports.viewreport = async (req, res) => {
  var SO_id = req.body["SO_id"];
  //console.log(req.body);

  var htmlurl = "/reportissuer/get_report/" + SO_id + "/html";
  res.redirect(htmlurl);
};

exports.home = async (req, res) => {
  res.render("./common/staff_home_page.ejs", {
    usertype: "reportissuer",
    activepage: "Home",
    title: "Report Issuer home",
  });
};
