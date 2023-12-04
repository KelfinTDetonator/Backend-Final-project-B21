const jwt = require('jsonwebtoken');

const checkToken = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    return res.status(403).json({
      error: 'Please provide a token',
    });
  }

  if (token.toLowerCase().startsWith('bearer')) {
    token = token.slice('bearer'.length).trim();
  }

  try {
    const jwtPayload = jwt.verify(token, 'secretKey');

    if (!jwtPayload) {
      return res.status(403).json({
        error: 'Unauthenticated',
      });
    }

    req.user = jwtPayload; // Menetapkan informasi pengguna ke dalam req.user
    req.userRole = jwtPayload.role; // Menetapkan informasi peran ke dalam req.userRole
    next();
  } catch (error) {
    return res.status(403).json({
      error: 'Unauthenticated',
    });
  }
};

module.exports = checkToken;
