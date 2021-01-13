const ejs = require("ejs");
const Ticket = require("../models/ticket.js");
const ticket = new Ticket();

exports.createTicket = async (req, res) => {
    const result = await ticket.Initiate(req.body);
    if (result.validationError)
        return res.status(400).send(result.validationError);
    if (result.connectionError)
        return res.status(500).send("Internal Server Error!");
    if (result.error) return res.status(400).send("Bad Request!");
    res.status(200).send("Query is inserted!");
};
