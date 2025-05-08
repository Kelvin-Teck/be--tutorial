const jwt = require("jsonwebtoken");

const Auth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      res.status(403).json({ message: "Invalid Token" });
    }

    const verifyToken = jwt.verify(token, "secret-key");

    const checkexpiration = verifyToken.exp < new Date().getTime();
    console.log(checkexpiration);

    if (!checkexpiration) {
      return res
        .status(403)
        .json({ message: "Token expired...Try login again" });
    }

    req.user = verifyToken;

    next();
  } catch (error) {

    if ((error.name = "TokenExpired")) {
      return res
        .status(403)
        .json({ message: "Token expired...Try login again" });
    }

    return res.status(500).json({
      message: "Internal Server Error " + error.message,
    });
  }
};

module.exports = {
  Auth,
};
