const express = require("express");
const app = express();
const path = require("path");
const config = require("config");
const cookieParser = require("cookie-parser");

//Environment Variables
checkEnvironmentVariable("database_credentials.password", "mysql_password");
checkEnvironmentVariable("jwtPrivateKey", "jwtPrivateKey");
checkEnvironmentVariable(
  "email_transporter_credentials.auth.user",
  "email_address"
);
checkEnvironmentVariable(
  "email_transporter_credentials.auth.pass",
  "email_password"
);

//Routers
const authRouter = require("./routes/auth");
const customerRouter = require("./routes/customer");
const cashierRouter = require("./routes/routers");
const reportRouter = require("./routes/emission_report");
const receptionistRouter = require("./routes/receptionist");
const ticketRouter = require("./routes/ticket");
const customerRouter = require("./routes/customer")

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.static(path.join(__dirname, "../node_modules/bootstrap/dist")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/customer", customerRouter);
app.use("/cashier", cashierRouter);
app.use("/report", reportRouter);
app.use("/receptionist", receptionistRouter);
app.use("/ticket",ticketRouter);
app.use("/customer",customerRouter);





const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));

function checkEnvironmentVariable(envPath, envName) {
  if (!config.has(envPath)) {
    console.log(new Error(`${envName} (Enviroment Variable) is not defined`));
    process.exit(1);
  }
}
