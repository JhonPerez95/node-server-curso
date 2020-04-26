require("dotenv").config();

var jwt = require("jsonwebtoken");

//=================
// Token
//=================
let verificaToken = (req, res, next) => {
  let token = req.get("token");
  jwt.verify(token, process.env.SEED, (err, decode) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err,
      });
    }

    req.user = decode.user;
  });
  next();
};
let verificaRoleAdmin = (req, res, next) => {
  let user = req.user;

  if (user.role === "ADMIN_ROLE") {
    next();
  } else {
    return res.json({
      ok: false,
      err: {
        message: "El usuario no es Administrador",
      },
    });
  }
};

// Token IMG

let verificaTokenImg = (req, res, next) => {
  let token = req.query.token;

  jwt.verify(token, process.env.SEED, (err, decode) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err,
      });
    }

    req.user = decode.user;
  });

  next();
};

module.exports = {
  verificaToken,
  verificaRoleAdmin,
  verificaTokenImg,
};
