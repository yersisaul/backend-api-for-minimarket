const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      error: {
        message: 'No token provided',
        status: 401
      }
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      error: {
        message: 'Invalid token',
        status: 401
      }
    });
  }
};

const verifyRole = (rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({
        error: {
          message: 'Unauthorized',
          status: 401
        }
      });
    }

    if (!rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({
        error: {
          message: 'Forbidden: Insufficient permissions',
          status: 403
        }
      });
    }

    next();
  };
};

module.exports = {
  verifyToken,
  verifyRole
};
