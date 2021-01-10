const express = require("express");
const app = express();

//Routers
const authRouter = require("./routes/auth");
const cashierRouter = require("./routes/routers");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/register", authRouter);
app.use("/cashier", cashierRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
