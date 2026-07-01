const { verifyToken } = require('../utils/jwt');
const { errorResponse } = require('../utils/response');

const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 401, 'Access denied. No token provided.');
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return errorResponse(res, 401, 'Invalid or expired token.');
    }

    req.user = decoded;
    next();
  } catch (error) {
    return errorResponse(res, 500, 'Internal server error during authentication.');
  }
};

module.exports = authenticate;
