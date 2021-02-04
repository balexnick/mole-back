const express = require("express");
const routes = require("./routes/routes");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config({
  path: ".env"
});
const app = express();
const hostname = "127.0.0.1";
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type,x-access-token"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);

  next();
});

app.use(routes);

const server = app.listen(process.env.PORT || 8080, hostname, () => {
  console.log(`Express running → PORT ${server.address().port}`);
});