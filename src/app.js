const express = require("express");
const app = express();
const path = require("path");
const config = require("config");

checkEnvironmentVariable("database_credentials.password");
checkEnvironmentVariable("jwtPrivateKey");
checkEnvironmentVariable("email_transporter_credentials.auth.user");
checkEnvironmentVariable("email_transporter_credentials.auth.pass");

//Routers
const authRouter = require("./routes/auth");
const Database = require("./database/database");
const cashierRouter = require("./routes/routers");
const reportRouter = require("./routes/emission_report");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "../public")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRouter);
app.use("/cashier", cashierRouter);
app.use("/report", reportRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));

function checkEnvironmentVariable(envName) {
  if (!config.has(envName)) {
    console.log(new Error(`${envName} (Enviroment Variable) is not defined`));
    process.exit(1);
  }
}
