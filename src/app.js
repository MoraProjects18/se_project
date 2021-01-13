const express = require("express");
const app = express();
const authRouter = require("./routes/auth");
const Database = require("./database/database");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/register", authRouter);
app.use("/test", async (req, res) => {
  const database = new Database();
  const result = await database.delete("contact_no", ["user_id", "=", "5"]);
  res.status(200).send(result);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
