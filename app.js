const express = require("express");
const routes = require("./routes/routes");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config({
  path: ".env"
});
const app = express();

mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useFindAndModify: false
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type,x-access-token"
  );
  next();
});

app.use(routes);

const server = app.listen(process.env.PORT || 8080, () => {
  console.log(`Express running → PORT ${server.address().port}`);
});