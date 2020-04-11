const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("underscore");

const User = require("../models/user");
const { verificaToken, verificaRoleAdmin } = require("../middlewares/authe");

const app = express();

app.get("/user", verificaToken, (req, res) => {
  // return res.json({
  //   Usuario: req.user,
  //   Nombre: req.user.name,
  //   Email: req.user.email,
  // });
  let desde = Number(req.query.desde || 0);
  let limit = Number(req.query.limit || 5);
  User.find({ status: true }, "name email role status google img")
    .limit(limit)
    .skip(desde)
    .exec((err, users) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }
      User.countDocuments({ status: true }, (err, conteo) => {
        res.json({
          ok: true,
          users,
          cuantos: conteo,
        });
      });
    });
});

app.post("/user", [verificaToken, verificaRoleAdmin], (req, res) => {
  let body = req.body;

  let user = new User({
    name: body.name,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    role: body.role,
  });

  user.save((err, userDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }
    res.json({
      ok: true,
      user: userDB,
    });
  });
});

app.put("/user/:id", [verificaToken, verificaRoleAdmin], (req, res) => {
  let id = req.params.id;

  let body = _.pick(req.body, ["name", "email", , "role", "status"]);
  let options = {
    new: true,
    runValidators: true,
  };

  User.findByIdAndUpdate(id, body, options, (err, userDB) => {
    if (err) {
      return res.status(400).json({
        mensaje: "No se pudo actualizar",
        ok: false,
        err,
      });
    }
    res.json({
      message: "se actualizo satisfactoriamente",
      ok: true,
      user: userDB,
    });
  });
});

app.delete("/user/:id", [verificaToken, verificaRoleAdmin], (req, res) => {
  let id = req.params.id;
  let status = {
    status: false,
    new: true,
  };

  // User.findByIdAndRemove(id, (err, userDelete) => {
  User.findByIdAndUpdate(id, status, (err, userDelete) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }
    if (userDelete === null) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "User not Found ",
        },
      });
    }
    res.json({
      ok: true,
      usuario: userDelete,
    });
  });
});

module.exports = app;
