const express = require("express");
const routes = require("./routes/routes");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
// const buildPath = path.join(__dirname, 'build');

require("dotenv").config({
  path: ".env"
});

const app = express();
// app.use(express.static(buildPath));

mongoose.connect(`${process.env.DATABASE}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})
.then(() => console.log('Database connected.'))
.catch(err => console.log(err));

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
  res.setHeader("Access-Control-Allow-Credentials", true);

  next();
});

app.use(routes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/build/index.html'));
});

const server = app.listen(process.env.PORT || 8080, () => {
  console.log(`Express running → PORT ${server.address().port}`);
});