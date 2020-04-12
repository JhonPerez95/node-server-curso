require("dotenv").config();

const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.CLIENT_ID);

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
    // expiration = parseInt(process.env.EXPIRATION_TOKEN); 60 * 60 * 24 * 30
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

// Config Google
async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID,
  });
  const payload = ticket.getPayload();

  return {
    name: payload.name,
    email: payload.email,
    img: payload.picture,
    google: true,
  };
}

//
app.post("/google", async (req, res) => {
  let token = req.body.idtoken;
  let userGoogle = await verify(token).catch((e) => {
    return res.status(403).json({
      ok: false,
      error: e,
    });
  });
  //   // Validaciones para guardar db
  User.findOne({ email: userGoogle.email }, (err, userDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    // Se valida si el usuario ya se habia logueado por google
    if (userDB) {
      if (userDB.google === false) {
        return res.status(400).json({
          ok: false,
          err: {
            message: "Debe autenticarce por su cuenta normal",
          },
        });
      } else {
        let token = jwt.sign(
          {
            user: userDB,
          },
          process.env.SEED,
          { expiresIn: 60 * 60 * 24 * 30 }
        );
        return res.json({
          ok: true,
          usuario: userDB,
          token,
        });
      }
    } else {
      // Usuario no existe en nuestra base de datos
      let user = new User();
      user.name = userGoogle.name;
      user.email = userGoogle.email;
      user.img = userGoogle.img;
      user.google = true;
      user.password = ":D";

      user.save((err, userDB) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            err,
          });
        }
        let token = jwt.sign(
          {
            user: userDB,
          },
          process.env.SEED,
          { expiresIn: 60 * 60 * 24 * 30 }
        );
        return res.json({
          ok: true,
          usuario: userDB,
          token,
        });
      });
    }
  });
});
module.exports = app;
