require("./config/config");
port = process.env.PORT;

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//
app.use(require("./routes/user"));

// Connect to db
mongoose.connect("mongodb://localhost:27017/cafe", (err, res) => {
  if (err) {
    throw err;
  } else {
    console.log("Base de datos ONLINE");
  }
});

// Start Server
app.listen(port, () => {
  console.log(`Escuchando el puerto ${port}`);
});
