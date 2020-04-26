const express = require("express");
const fileUpload = require("express-fileupload");

const fs = require("fs");
const path = require("path");

const app = express();

const User = require("../models/user");
const Product = require("../models/product");

// Middleware
app.use(fileUpload({ useTempFiles: true }));

app.put("/upload/:tipo/:id", (req, res) => {
  let tipo = req.params.tipo;
  let id = req.params.id;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      ok: false,
      message: "No files were uploaded.",
    });
  }

  // Validacion tipo
  let tiposValidos = ["products", "users"];

  if (tiposValidos.indexOf(tipo) < 0) {
    res.status(400).json({
      ok: false,
      err: {
        message: "los tipos validos son: " + tiposValidos.join(", "),
      },
      tipo,
    });
  }

  // Validacion  extension
  let data = req.files.img;
  let nombreData = data.name.split(".");
  let extension = nombreData[nombreData.length - 1];

  let extensionesValidas = ["png", "jpg", "gif", "jpeg"];

  if (extensionesValidas.indexOf(extension) < 0) {
    res.status(400).json({
      ok: false,
      err: {
        message:
          "las extensiones permitidas son: " + extensionesValidas.join(", "),
      },
      extension,
    });
  }

  //Cambiar el nombre del archivo
  let nombreImg = `${id}-${new Date().getMilliseconds()}.${extension}`;

  // Carga de img validada
  data.mv(`upload/${tipo}/${nombreImg}`, (err) => {
    if (err) {
      deleteDAta(nombreImg, tipo);

      return res.status(500).json({
        ok: false,
        err,
      });
    }

    // Imagen se carga
    if (tipo == "users") {
      imgUser(id, nombreImg, res);
    } else {
      imgProduct(id, nombreImg, res);
    }
  });
});

let imgUser = (id, nombreImg, res) => {
  User.findById(id)
    .then(async (userDB) => {
      deleteDAta(userDB.img, "users");

      userDB.img = nombreImg;
      let imgSave = await userDB.save();
      res.json({
        ok: true,
        imgSave,
      });
    })
    .catch((err) => {
      deleteDAta(nombreImg, "users");

      res.status(500).json({
        ok: false,
        err,
      });
    });
};

let imgProduct = (id, nombreImg, res) => {
  Product.findById(id)
    .then(async (productDB) => {
      deleteDAta(productDB.img, "products");

      productDB.img = nombreImg;
      let imgSave = await productDB.save();
      res.json({
        ok: true,
        imgSave,
      });
    })
    .catch((err) => {
      deleteDAta(nombreImg, "products");

      res.status(500).json({
        ok: false,
        err,
      });
    });
};

let deleteDAta = (nombreImg, tipo) => {
  let pathImg = path.resolve(__dirname, `../../upload/${tipo}/${nombreImg}`);
  if (fs.existsSync(pathImg)) {
    fs.unlinkSync(pathImg);
  }
};

module.exports = app;
