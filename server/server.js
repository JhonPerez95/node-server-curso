require("./config/config");
port = process.env.PORT;

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get("/usuario", (req, res) => {
  res.json("Hola mundo");
});

app.post("/usuario", (req, res) => {
  let body = req.body;

  if (body.nombre === undefined) {
    res.status(400).json({
      ok: false,
      mensaje: "El nombre es necesario",
    });
  } else {
    res.json({
      body,
    });
  }
});

app.put("/usuario/:id", (req, res) => {
  let id = req.params.id;
  res.json({
    id,
  });
});

app.delete("/usuario", (req, res) => {
  res.json("Hola mundo");
});

app.listen(port, () => {
  console.log(`Escuchando el puerto ${port}`);
});
