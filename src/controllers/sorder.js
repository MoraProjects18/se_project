const ejs = require("ejs");
const ServiceOrder = require("../models/serviceorder");
const sorder = new ServiceOrder();

exports.getinitiatePage = async (req, res) => {
  data = {
      dataFound: false,
      
  };
  res.render("./receptionist/initiateso.ejs", data);
};

exports.getcontinuePage = async (req, res) => {
  data = {
      dataFound: false,
      error: {
        status:false
      },
  };
  res.render("./receptionist/continueso.ejs", data);
};

exports.initiateSO = async (req, res) => {
  const result = await sorder.Initiate(req.body);
  const received = JSON.parse(JSON.stringify(result.data));
  if (result.validationError)
    return res.status(400).send(result.validationError);
  if (result.connectionError)
    return res.status(500).send("Internal Server Error!");
  if (result.error) return res.status(400).send("Bad Request!");
  res.status(200).send(received);
};

exports.continueSO = async (req, res) => {
  const result = await sorder.paySO(req.body);
  console.log(result);
  if (result.validationError)
    return res.status(400).send(result.validationError);
  if (result.connectionError)
    return res.status(500).send("Internal Server Error!");
  if (result.error) return res.status(400).send("Bad Request!");
  res.status(200).send({ status: "success" , message: "Service Order continued" });
};

exports.failedSO = async (req, res) => {
  const result = await sorder.GetCustomer(req.body);
  if (result.validationError) {
    data = {
      error: {
        status:true,
        message: result.validationError.error.message,
      },
      value: result.validationError.value,
    };
    return res.render("./receptionist/continueso.ejs", data);
  }
  if (result.connectionError)
    return res.status(500).send("Internal Server Error!");
  if (result.error) return res.status(400).send("Bad Request!");
    
  if (result.resultData != 0) {
    var customerdata =  JSON.parse(JSON.stringify(result.resultData[0]));
    const failed = await sorder.GetFailedSO(req.body);
    var faileddata = JSON.parse(JSON.stringify(failed.resultData))
    var available_so = [];
    for (var so of faileddata){
      if (notExpired(so.start_date)){
        available_so.push(so)
      }
    }
    data = {
          dataFound: true,
          error: {
            status: true
          },
          customer: customerdata,
          available: available_so
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
    res.render("./receptionist/todayso.ejs", data);

  };

  exports.getallData = async (req, res) => {
    const result = await sorder.GetCustomer(req.body);
    if (result.validationError) {
      data = {
        error: {
          message: result.validationError.error.message,
        },
        value: result.validationError.value,
      };
      // return res.status(400).send(invoiceR.validationError);
      return res.render("./receptionist/initiateso.ejs", data);
    }
    if (result.connectionError)
      return res.status(500).send("Internal Server Error!");
    if (result.error) return res.status(400).send("Bad Request!");
      
    if (result.resultData != 0) {
      var customerdata =  JSON.parse(JSON.stringify(result.resultData[0]));
      const vehicle = await sorder.GetVehicle(customerdata.user_id);
      var vehicledata = JSON.parse(JSON.stringify(vehicle.resultData))
      data = {
            dataFound: true,
            customer: customerdata,
            vehicle: vehicledata
            }
      } else {
        data = {
          dataFound: false,
          error: {
            status: false,
            message: "No user available",
          },
        };
      }
      //console.log(data);
      res.render("./receptionist/initiateso.ejs", data);
  };

  function notExpired(date){
    const max_days = 180; //6 months
    var start = new Date(date).getTime(); 
    var today = new Date().getTime();
    var difference = parseInt((today-start) / (1000 * 3600 * 24));
    if (max_days>difference){
        return true;
    }else{
        return false;
    }
};

  