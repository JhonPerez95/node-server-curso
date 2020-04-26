const express = require("express");

const fs = require("fs");
const path = require("path");
const app = express();

const { verificaTokenImg } = require("../middlewares/authe");

app.get("/img/:tipo/:img", verificaTokenImg, (req, res) => {
  let tipo = req.params.tipo;
  let img = req.params.img;

  let pathImg = path.resolve(__dirname, `../../upload/${tipo}/${img}`);

  if (fs.existsSync(pathImg)) {
    res.sendFile(pathImg);
  } else {
    let pathNoImg = path.resolve(__dirname, "../assets/no-image.jpg");
    res.sendFile(pathNoImg);
  }
});

module.exports = app;
