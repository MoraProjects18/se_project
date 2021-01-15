const express = require("express");
const app = express();
const path = require("path");

//Routers
const authRouter = require("./routes/auth");
const Database = require("./database/database");
const cashierRouter = require("./routes/routers");
const reportRouter = require("./routes/emission_report");
const receptionistRouter = require("./routes/receptionist");
const ticketRouter = require("./routes/ticket");
const customerRouter = require("./routes/customer");
const { title } = require("process");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "../public")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/register", authRouter);
app.use("/test", async (req, res) => {
  const database = new Database();
  const result = await database.delete("contact_no", ["user_id", "=", "5"]);
  res.status(200).send(result);
});
app.use("/cashier", cashierRouter);
app.use("/report", reportRouter);
app.use("/receptionist", receptionistRouter);
app.use("/ticket",ticketRouter);
app.use("/customer",customerRouter);


// ------------------------------------------

app.get('/customer_home_page', function (req, res) {  

  var nav = [
    { page: 'Home', path: "customer_home_page",status : "active" },
    { page: 'Service order details', path: "Service_order_details",status : "deactive" },
    { page: 'Ticket details', path: "Ticket_details",status : "deactive" }   
  ];
  var profile = "customer_profile"
  var title="customer home page"
  res.render('common/customer_home_page', {
    nav: nav,
    profile: profile,
    title:title
  });
});

app.get('/service_order_details', function (req, res) {  

  var nav = [
    { page: 'Home', path: "customer_home_page",status : "deactive" },
    { page: 'Service order details', path: "Service_order_details",status : "active" },
    { page: 'Ticket details', path: "Ticket_details",status : "deactive" }   
  ];
  var profile = "customer_profile"
  var title=" service order details"
  res.render('common/service_order_details', {//service_order_details page 
    nav: nav,
    profile: profile,
    title:title
  });
});

app.get('/ticket_details', function (req, res) {  

  var nav = [
    { page: 'Home', path: "customer_home_page",status : "deactive" },
    { page: 'Service order details', path: "Service_order_details",status : "deactive" },
    { page: 'Ticket details', path: "Ticket_details",status : "active" }   
  ];
  var profile = "customer_profile"
  var title="ticket details"
  res.render('common/ticket_details', {//ticket_details page
    nav: nav,
    profile: profile,
    title:title
  });
});

app.get('/createTicket', function (req, res) {

  var nav = [
    { page: 'Home', path: "customer_home_page",status : "deactive" },
    { page: 'Service order details', path: "Service_order_details",status : "deactive" },
    { page: 'Ticket details', path: "Ticket_details",status : "deactive" }   
  ];
  var title = "createTicket"
  var profile = "customer_profile"
  res.render('ticket/createTicket', {
    nav: nav,
    profile: profile,
  title:title
});
});

app.get('/customer_profile', function (req, res) {
  var nav = [
    { page: 'Home', path: "customer_home_page",status : "deactive" },
    { page: 'Service order details', path: "Service_order_details",status : "deactive" },
    { page: 'Ticket details', path: "Ticket_details",status : "deactive" }   
  ];
  var profile = "customer_profile"
  var title="customer profile"
   res.render('common/customer_profile', {
    nav: nav,
    profile: profile,
    title:title
    
});
});

// ---------------------------------------------------


app.get('/admin_home_page', function(req, res) { 
  var nav = [
    { page: 'Home', path: "admin_home_page" ,status : "active" },
    { page: 'Add employee', path:"Add_employee" ,status : "deactive" }   
  ];
  var title="admin home page"
  var profile="admin_profile"
    res.render('common/staff_home_page', {
      nav: nav,
      profile: profile,
      title:title
  });
});


app.get('/receptionist_home_page', function(req, res) {
  var nav = [
    { page: 'Home', path: "receptionist_home_page" ,status : "active" },
    { page: 'Ticket details', path: "Ticket_details" ,status : "deactive" },
    { page: 'Initiate service order', path: "Initiate_service_order" ,status : "deactive" }
  ];
  var profile = "receptionist_profile"
  var title="receptionist home page"
    res.render('common/staff_home_page', {
      nav: nav,
      profile: profile,
      title:title
  });
});


app.get('/cashier_home_page', function(req, res) {
  var nav = [
    { page: 'Home', path: "cashier_home_page",status : "active" },
    { page: 'Invoice Payment', path: "Invoice_Payment",status : "deactive" }   
  ];
  var title="cashier home page"
  var profile="cashier_profile"
    res.render('common/staff_home_page', {
      nav: nav,
      profile: profile,
      title:title
  });
});
// -----------------------data wants from backend
app.get('/payment', function(req, res) {
  var nav = [
    { page: 'Home', path: "cashier_home_page",status : "deactive" },
    { page: 'Invoice Payment', path: "Invoice_Payment",status : "active" }   
  ];
  var title="payment"
  var profile="cashier_profile"
    res.render('cashier/payment', {
      nav: nav,
      profile: profile,
      title:title
  });
});
// -----------------------

app.get('/reportissuer_home_page', function(req, res) {
  var nav = [
    { page: 'Home', path: "reportissuer_home_page" ,status : "active" },
    { page: 'Issue Report', path: "issue_Report" ,status : "deactive" }   
  ];
  var profile = "reportissuer_profile"
  var title="reportissuer home page"
    res.render('common/staff_home_page', {
      nav: nav,
      profile: profile,
      title:title
  });
});




app.get('/admin_profile', function(req, res) { 
  var nav = [
    { page: 'Home', path: "admin_home_page" ,status : "deactive" },
    { page: 'Add employee', path:"Add_employee" ,status : "deactive" }   
  ];
  var profile = "admin_profile"
  var title="admin profile"
    res.render('common/staff_profile', {
      nav: nav,
      profile: profile,
      title:title
  });
});


app.get('/receptionist_profile', function(req, res) {
  var nav = [
    { page: 'Home', path: "receptionist_home_page" ,status : "deactive" },
    { page: 'Ticket details', path: "Ticket_details" ,status : "deactive" },
    { page: 'Initiate service order', path: "Initiate_service_order" ,status : "deactive" }
  ];
  var profile = "receptionist_profile"
  var title="receptionist profile"
    res.render('common/staff_profile', {
      nav: nav,
      profile: profile,
      title:title
  });
});


app.get('/cashier_profile', function(req, res) {
  var nav = [
    { page: 'Home', path: "cashier_home_page",status : "deactive" },
    { page: 'Invoice Payment', path: "Invoice_Payment",status : "deactive" }   
  ];
  var title="cashier profile"
  var profile="cashier_profile"
    res.render('common/staff_profile', {
      nav: nav,
      profile: profile,
      title:title
  });
});


app.get('/reportissuer_profile', function(req, res) {
  var nav = [
    { page: 'Home', path: "reportissuer_home_page" ,status : "deactive" },
    { page: 'Issue Report', path: "issue_Report" ,status : "deactive" }   
  ];
  var profile = "reportissuer_profile"
  var title="reportissuer profile"
    res.render('common/staff_profile', {
      nav: nav,
      profile: profile,
      title:title
  });
});


app.get('/issue_Report', function(req, res) {
  var nav = [
    { page: 'Home', path: "reportissuer_home_page" ,status : "deactive" },
    { page: 'Issue Report', path: "issue_Report" ,status : "active" }   
  ];
  var profile = "reportissuer_profile"
  var title="emission report"
    res.render('ReportIssuer/EmissionReport', {
      nav: nav,
      profile: profile,
      title:title
  });
});

app.get('/register', function (req, res) {
  var title="register"
    res.render('common/register', {
    title:title
  });
});


app.get('/login', function (req, res) {
  var title="login"
    res.render('common/login', {
    title:title
  });
});

app.get('/getsodetails', function (req, res) {
  var title="getsodetails"
    res.render('common/getsodetails', {
    title:title
  });
});




const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
