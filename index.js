const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const oracledb = require("oracledb");
const bodyParser = require("body-parser");
const port = process.env.PORT;
const config = require("./config");
const Routes = require("./routes/routes.customers");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const initialize = async () => {
  try {
    await oracledb.createPool(config);
    console.log("Oracle DB connection pool started");
  } catch (error) {
    console.error("init() error: " + error.message);
  }
};

app.use("/api", Routes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

initialize();
