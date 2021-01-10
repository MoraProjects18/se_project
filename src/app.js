const express = require("express");
const app = express();
const authRouter = require("./routes/auth");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/register", authRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
