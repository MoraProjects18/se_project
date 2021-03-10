const ejs = require("ejs");
var $ = require("jquery");
const Ticket = require("../models/ticket.js");
const Staff = require("../models/staff.js");
const ticket = new Ticket();
const staff = new Staff();
const User = require("../models/user");
const user = new User();
const config = require("config");

// exports.getTicketPage = async (req, res) => {
//   var result = await ticket.GetBranch();

//   if (result.connectionError)
//     return res.status(500).render("common/errorpage", {
//       title: "Error",
//       status: "500",
//       message: "Internal Server Error",
//     });

//   if (result.error)
//     return res.status(400).render("common/errorpage", {
//       title: "Error",
//       status: "400",
//       message: "Bad Request",
//     });
//   data = {
//     dataFound: false,
//     branch: result.result,
//   };

//   res.render("../views/ticket/createTicket.ejs", data);
// };
exports.getTimes = async (req, res) => {
  var result = await ticket.GetTime(req.query.branch_id, req.query.start_date);
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
    .send({ data: result.result, times: config.get("ticket_time_slots") });
};

exports.createTicket = async (req, res) => {
  req.body.user_id = req.user.user_id;

  const result = await ticket.Initiate(req.body);
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

  res.status(200).redirect(`/customer/ticketDetails`);
};

exports.getTodayTicket = async (req, res) => {
  data = {
    usertype: "receptionist",
    activepage: "Ticket details",
    title: "Tickets Details",
  };

  res.status(200).render("./ticket/todayTicket.ejs", data);
};

exports.getTodayTicketData = async (req, res) => {
  const data_branch = await staff.get_branch_id(req.user.user_id);

  const result = await ticket.TodayTicket(data_branch.result[0].branch_id);

  res.status(200).send({
    result: result.resultData,
    timePeriod: parseInt(config.get("closing_period")),
  });
};

exports.confirmTicket = async (req, res) => {
  
  const data = req.query.ticket_id;

  const result = await ticket.Close(data);
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
  if (result.error) return res.status(400).send("Bad Request!");
  res.status(200).redirect(`/receptionist/ticket/todayTicket`);
  
};
