const ejs = require("ejs");
var $ = require('jquery');
const Ticket = require("../models/ticket.js");
const ticket = new Ticket()

exports.getTicketPage = async (req, res) => {
    var result = await ticket.GetBranch();

    if (result.connectionError)
        return res.status(500).send("Internal Server Error!");
    if (result.error) return res.status(400).send("Bad Request!");

    data = {
        dataFound: false,
        branch : result.result
    };

    res.render("../views/ticket/createTicket.ejs", data);
};

exports.getTimes = async (req, res) => {
    var result = await ticket.GetTime(req.query.branch_id,req.query.start_id);

    if (result.connectionError)
        return res.status(500).send("Internal Server Error!");
    if (result.error) return res.status(400).send("Bad Request!");



    res.search(result.result);
};

exports.createTicket = async (req, res) => {
    console.log(req.body);
    const result = await ticket.Initiate(req.body);
    if (result.validationError)
        return res.status(400).send(result.validationError);
    if (result.connectionError)
        return res.status(500).send("Internal Server Error!");
    if (result.error) return res.status(400).send("Bad Request!");
    res.status(200).send("Query is inserted!");
};


exports.getUserTicket = async (req, res) => {
    const result = await ticket.UserTicket();
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
            ticket: mydata
        }
    } else {
        data = {
            dataFound: false,
            error: {
                status: false,
                message: "No data to show",
            },
        };
    }
    console.log(data);
    res.render("./ticket/viewTicketTable.ejs", data);

};


exports.getTodayTicket = async (req, res) => {
    const result = await ticket.TodayTicket();
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
            ticket: mydata
        }
    } else {
        data = {
            dataFound: false,
            error: {
                status: false,
                message: "No data to show",
            },
        };
    }
    console.log(data);
    res.render("./ticket/todayTicket.ejs", data);

};
