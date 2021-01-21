const ejs = require("ejs");
var $ = require('jquery');
const Ticket = require("../models/ticket.js");
const Staff = require("../models/staff.js");
const ticket = new Ticket();
const staff = new Staff();
const User = require("../models/user");
const user = new User();

exports.getTicketPage = async (req, res) => {
    var result = await ticket.GetBranch();

    if (result.connectionError)
        return res.status(500).send("Internal Server Error!");
    if (result.error) return res.status(400).send("Bad Request!");

    data = {
        dataFound: false,
        branch : result.result
    };


    res.render("../views/ticket/createTicket.ejs",data);

};
//{usertype: "customer",activepage:"home",title:"customer home"}
exports.getTimes = async (req, res) => {
    console.log(req.query.branch_id);
    var result = await ticket.GetTime(req.query.branch_id,req.query.start_date);

    if (result.connectionError)
        return res.status(500).send("Internal Server Error!");
    if (result.error) return res.status(400).send("Bad Request!");



    res.search(result.result);
};

exports.createTicket = async (req, res) => {
    console.log(req.body);
    console.log(req.user.user_id);
    req.body.user_id = req.user.user_id;
    console.log(req.body);
    const result = await ticket.Initiate(req.body);
    if (result.validationError)
        return res.status(400).send(result.validationError);
    if (result.connectionError)
        return res.status(500).send("Internal Server Error!");
    if (result.error) return res.status(400).send("Bad Request!");
    res
        .status(200)
        .redirect(`/customer/ticketDetails`);
};



exports.getTodayTicket = async (req, res) => {
    const data = await staff.get_branch_id(req.user.user_id);
    const result = await ticket.TodayTicket(data[0]);
    //console.log(result);
    if (result.validationError)
        return res.status(400).send(result.validationError);
    if (result.connectionError)
        return res.status(500).send("Internal Server Error!");
    if (result.error) return res.status(400).send("Bad Request!");

    if (result.resultData != 0) {
        var strng=JSON.stringify(result.resultData);
        var mydata =  JSON.parse(strng);

        data = {
            dataFound: true,
            ticket: mydata,
            usertype: "receptionist",
            activepage: "Ticket details",
            title: "Tickets Details",
        }
    } else {
        data = {
            dataFound: false,
            usertype: "receptionist",
            activepage: "Ticket details",
            title: "Tickets Details",
            error: {
                status: false,
                message: "No Tickets for Today",
            },
        };
    }
    console.log(data);
    res.render("./ticket/todayTicket.ejs", data);

};



