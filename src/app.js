const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const path = require("path");
const config = require("config");
const cookieParser = require("cookie-parser");

//Routers
const authRouter = require("./routes/auth");
const cashierRouter = require("./routes/cashier");
const reportRouter = require("./routes/emission_report");
const receptionistRouter = require("./routes/receptionist");
const ticketRouter = require("./routes/ticket");
const staffRouter = require("./routes/staff");
const adminRouter = require("./routes/admin");
const { title } = require("process"); //????
const customerRouter = require("./routes/customer");
const guestRouter = require("./routes/guest");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.static(path.join(__dirname, "../node_modules/bootstrap/dist")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/cashier", cashierRouter);
app.use("/reportissuer", reportRouter);
app.use("/receptionist", receptionistRouter);
app.use("/ticket", ticketRouter);
app.use("/home", guestRouter);
app.use("/staff", staffRouter);
app.use("/admin", adminRouter);
app.use("/customer", customerRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));

app.get("/", (req, res) => {
  res.redirect("/home");
});

app.get("/*", (req, res) => {
  res.status(404).render("common/errorpage", {
    title: "Page Not Found",
    status: 404,
    message: "Page Not Found",
  });
});
