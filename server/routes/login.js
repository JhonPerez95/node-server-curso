require("dotenv").config();

const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

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
      res.status(400).json({
        ok: false,
        err: {
          message: "Usuario o (contraseña) incorrectas",
        },
      });
      return console.log(userDB.user);
    }
    // JWT
    // expiration = parseInt(process.env.EXPIRATION_TOKEN);
    let token = jwt.sign(
      {
        user: userDB,
      },
      process.env.SEED,
      { expiresIn: 60 * 60 * 24 * 30 }
    );
    //
    res.json({
      ok: true,
      usuario: userDB,
      token: token,
    });
  });
});

module.exports = app;
