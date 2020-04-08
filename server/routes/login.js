const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");

const app = express();

app.post("/login", (req, res) => {
  let body = req.body;
  User.findOne({ email: body.email }, (err, userDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    // Validacion de Usuario
    if (!userDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "(Usuario) o contraseña incorrectas",
        },
      });
    }
    // Validacion Contraseña
    if (!bcrypt.compareSync(body.password, userDB.password)) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "Usuario o (contraseña) incorrectas",
        },
      });
    }
    //
    res.json({
      ok: true,
      usuario: userDB,
      token: "123",
    });
  });
});

module.exports = app;
