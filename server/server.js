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

// Configuracion rutas globales
app.use(require("./routes/index"));

// Connect to db
mongoose.connect(
  process.env.URLDB,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err, res) => {
    if (err) {
      throw err;
    } else {
      console.log("Base de datons ONLINE");
    }
  }
);

// Start Server
app.listen(port, () => {
  console.log(`Escuchando el puerto ${port}`);
});
