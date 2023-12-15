const jwt = require("jsonwebtoken");

const checkToken = (req, res, next) => {
  try {
  let token = req.headers.authorization;

  if (!token) {
    return res.status(403).json({
      error: "Masukkan token terlebih dahulu",
    });
  }

  if (token.toLowerCase().startsWith("bearer")) {
    token = token.slice("bearer".length).trim();
  }

  
    const jwtPayload = jwt.verify(token, 'secretKey');

    if (!jwtPayload) {
      return res.status(403).json({
        error: "Belum login",
      });
    }

    req.user = {
      ...jwtPayload,
      userId: jwtPayload.userId, // Sesuaikan dengan nama properti ID pada objek payload Anda
    };
    // req.user = jwtPayload; 
    req.userRole = jwtPayload.role;
  } catch (error) {
    return res.status(403).json({
      error,
    });
  }
  next();
};

module.exports = checkToken;
