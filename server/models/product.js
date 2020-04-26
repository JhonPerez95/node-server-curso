const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es necesario"],
    },
    priceUni: {
      type: Number,
      required: [true, "El precio unitario es necesario"],
    },
    description: {
      type: String,
      required: false,
    },
    avaliable: {
      type: Boolean,
      required: true,
      default: true,
    },
    img: {
      type: String,
      required: false,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },

  { timestamps: true } // Crea fecha actualizada y modificada
);

module.exports = mongoose.model("Product", productSchema);
