const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  try {
    req.userId = jwt.verify(token, process.env.JWT_SECRET).id;
  } catch {
    return next(new AppError(401, 'Token inválido o ausente'));
  }
  next();
};
