require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
// // parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// // parse application/json
app.use(bodyParser.json());

// Public
app.use(express.static(path.resolve(__dirname, "../public")));

// Configuracion rutas globales
app.use(require("./routes/index"));

// Connect to db
require("./database");

// Start Server
port = process.env.PORT;
app.listen(port, () => {
  console.log(`Escuchando el puerto ${port}`);
});
