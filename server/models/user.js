const mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");

let rolesValid = {
  values: ["ADMIN_ROLE", "USER_ROLE"],
  message: "{VALUE} Esto no es un rol valido",
};

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "El Nombre es necesario"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "El Email es necesario"],
  },
  password: {
    type: String,
    required: [true, "El Contraseña es necesario"],
  },
  img: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    default: "USER_ROLE",
    enum: rolesValid,
  },
  status: {
    type: Boolean,
    default: true,
  },
  google: {
    type: Boolean,
    default: false,
  },
});

userSchema.methods.toJSON = function () {
  let user = this;
  let userObject = user.toObject();
  delete userObject.password;

  return userObject;
};

userSchema.plugin(uniqueValidator, {
  message: "{PATH} Debe de ser unico",
});

module.exports = mongoose.model("User", userSchema);
