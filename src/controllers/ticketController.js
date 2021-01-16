const ejs = require("ejs");
var $ = require('jquery');
const Ticket = require("../models/ticket.js");
const ticket = new Ticket();


exports.getTicketPage = async (req, res) => {
    data = {
        dataFound: false,
    };

    res.render("../views/ticket/createTicket.ejs", data);
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


exports.gettodaySO = async (req, res) => {
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
            sorder: mydata
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
