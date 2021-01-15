const ejs = require("ejs");
const ServiceOrder = require("../models/serviceorder");
const sorder = new ServiceOrder();

exports.getSOPage = async (req, res) => {
  data = {
      dataFound: false,
  };
  res.render("../views/common/getsodetails.ejs", data);
};

exports.initiateSO = async (req, res) => {
  const result = await sorder.Initiate(req.body);
  if (result.validationError)
    return res.status(400).send(result.validationError);
  if (result.connectionError)
    return res.status(500).send("Internal Server Error!");
  if (result.error) return res.status(400).send("Bad Request!");
  res.status(200).send("Service Order Initiated..");
};

exports.getbyidSO = async (req, res) => {
    const result = await sorder.GetById(req.body);
    if (result.validationError)
      return res.status(400).send(result.validationError);
    if (result.connectionError)
      return res.status(500).send("Internal Server Error!");
    if (result.error) return res.status(400).send("Bad Request!");
    res.send(result.result).status(200);
  };

  exports.closeSO = async (req, res) => {
    const result = await sorder.Close(req.body);
    if (result.validationError)
      return res.status(400).send(result.validationError);
    if (result.connectionError)
      return res.status(500).send("Internal Server Error!");
    if (result.error) return res.status(400).send("Bad Request!");
    res.status(200).send(`Service Order with ID ${req.body.service_order_id} Closed successfully..`);
  };

  exports.getmySO = async (req, res) => {
    const result = await sorder.GetMySO(req.body);
    if (result.validationError)
      return res.status(400).send(result.validationError);
    if (result.connectionError)
      return res.status(500).send("Internal Server Error!");
    if (result.error) return res.status(400).send("Bad Request!");
    res.status(200).send(result.result);
  };

  exports.gettodaySO = async (req, res) => {
    const result = await sorder.TodaySO();
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
    res.render("./receptionist/todayso.ejs", data);

  };

  