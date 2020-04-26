const express = require("express");

let { verificaToken, verificaRoleAdmin } = require("../middlewares/authe");

const Category = require("../models/category");

const app = express();

app.get("/category", verificaToken, (req, res) => {
  Category.find()
    .sort("description")
    .populate({ path: "user", select: "name" })
    .exec((err, categories) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }
      res.json({
        ok: true,
        categorias: categories,
      });
    });
});

app.get("/category/:id", verificaToken, (req, res) => {
  let id = req.params.id;

  Category.findById(id)
    .sort("description")
    .populate({ path: "user", select: "name" })
    .exec((err, categories) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }
      res.json({
        ok: true,
        categorias: categories,
      });
    });
});

app.post("/category", verificaToken, (req, res) => {
  let body = req.body;

  let category = new Category({
    description: body.description,
    user: req.user._id,
  });
  category.save((err, categoryDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      category: categoryDB,
    });
  });
});

app.put("/category/:id", verificaToken, (req, res) => {
  let id = req.params.id;
  let body = req.body;
  let update = {
    description: body.description,
  };
  let options = {
    new: true,
    runValidators: true,
    context: "query",
  };

  Category.findByIdAndUpdate(id, update, options, (err, categoryDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    if (!categoryDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "Categoria no encontrada",
        },
      });
    }
    res.json({
      ok: true,
      message: "se actualizo satisfactoriamente",
      category: categoryDB,
    });
  });
});

app.delete("/category/:id", [verificaToken, verificaRoleAdmin], (req, res) => {
  let id = req.params.id;

  Category.findByIdAndRemove(id, (err, categoryDelete) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }
    if (!categoryDelete) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "Category not Found ",
        },
      });
    }
    res.json({
      ok: true,
      mensaje: "Categoria a sido eliminada completamente",
      categoria: categoryDelete,
    });
  });
});
module.exports = app;
