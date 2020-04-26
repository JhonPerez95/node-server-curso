const express = require("express");

const Product = require("../models/product");
const { verificaToken } = require("../middlewares/authe");
const app = express();

// const { renderProduct } = require("../controller/product.controller");

// router.get("/product", verificaToken, renderProduct);

app.get("/product/", verificaToken, (req, res) => {
  let desde = Number(req.query.desde || 0);
  let limite = Number(req.query.limite || 5);

  Product.find({ avaliable: true })
    .limit(limite)
    .skip(desde)
    .populate({ path: "category", select: "description" })
    .populate({ path: "user", select: "name" })
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }
      res.json({
        ok: true,
        products,
      });
    });
});

app.get("/product/:id", verificaToken, (req, res) => {
  let id = req.params.id;
  Product.findById(id)
    .populate({ path: "user", select: "name" })
    .populate({ path: "category", select: "description" })
    .exec((err, product) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }
      if (!product.avaliable) {
        return res.status(400).json({
          ok: false,
          err: {
            message: "Producto no encontrado",
          },
        });
      }
      res.json({
        ok: true,
        product,
      });
    });
});

app.post("/product", verificaToken, (req, res) => {
  let body = req.body;
  let product = new Product({
    name: body.name,
    priceUni: body.priceUni,
    description: body.description,
    avaliable: body.avaliable,
    category: body.category,
    User: req.user._id,
  });
  product.save((err, productDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }
    res.json({
      ok: true,
      productDB,
    });
  });
});

app.put("/product/:id", verificaToken, (req, res) => {
  let id = req.params.id;
  let body = req.body;
  let options = {
    new: true,
    runValidators: true,
    context: "query",
  };
  Product.findByIdAndUpdate(id, body, options, (err, productDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    if (!productDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "Producto no encontrado",
        },
      });
    }
    res.json({
      ok: true,
      message: "Se actualizo correctamente",
      product: productDB,
    });
  });
});

app.delete("/product/:id", verificaToken, (req, res) => {
  let id = req.params.id;
  let avaliable = {
    avaliable: false,
    new: true,
  };
  Product.findByIdAndUpdate(id, avaliable, (err, productDelete) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }
    if (!productDelete.avaliable) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "Producto no encotrado ",
        },
      });
    }
    res.json({
      ok: true,
      message: "Este producto a sido eliminado correctamente",
      product: productDelete,
    });
  });
});
// Buscando producto
app.get("/product/search/:termino", verificaToken, (req, res) => {
  let termino = req.params.termino;
  // Expresion regular
  let regex = new RegExp(termino, "i");

  Product.find({ description: regex })
    .populate({ path: "category", select: "description" })
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }
      if (!products) {
        return res.status(400).json({
          ok: false,
          message: "No se encontro producto",
        });
      }
      res.json({
        ok: true,
        message: "Se encontro.. ",
        products,
      });
    });
});
module.exports = app;
