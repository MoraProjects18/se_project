const express = require("express");
const app = express();
const path = require("path");

//Routers
const authRouter = require("./routes/auth");
const cashierRouter = require("./routes/routers");
const reportRouter = require("./routes/emission_report");
const receptionistRouter = require("./routes/routers");
const ticketRouter = require("./routes/ticket");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "../public")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/register", authRouter);
app.use("/cashier", cashierRouter);
app.use("/report", reportRouter);
app.use("/receptionist", receptionistRouter);
app.use("/ticket",ticketRouter);


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
