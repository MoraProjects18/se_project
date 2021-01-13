const express = require("express");
const app = express();
const path = require("path");

//Routers
const authRouter = require("./routes/auth");
<<<<<<< HEAD
const Database = require("./database/database");
=======
const cashierRouter = require("./routes/routers");
const reportRouter = require("./routes/emission_report");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "../public")));
>>>>>>> 33d75a574621a5f1ae998bb780cb160019578242

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/register", authRouter);
<<<<<<< HEAD
app.use("/test", async (req, res) => {
  const database = new Database();
  const result = await database.delete("contact_no", ["user_id", "=", "5"]);
  res.status(200).send(result);
});
=======
app.use("/cashier", cashierRouter);
app.use("/report", reportRouter);
>>>>>>> 33d75a574621a5f1ae998bb780cb160019578242

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
