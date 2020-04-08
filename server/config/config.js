//=============
// Puerto
//=============

process.env.PORT = process.env.PORT || 3001;

//=============
// Entorno
//=============

process.env.NODE_ENV = process.env.NODE_ENV || "dev";

//=============
// Base de datos
//=============

let urlBD;
if (process.env.NODE_ENV === "dev") {
  urlBD = "mongodb://localhost:27017/cafe";
} else {
  urlBD =
    "mongodb+srv://TattoAdmin:BzmvbmULCafcDkJR@cluster0-9ixgq.mongodb.net/cafe";
}
process.env.URLDB = urlBD;
