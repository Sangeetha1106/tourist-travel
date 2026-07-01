const { errorResponse } = require('../utils/response');

const authorize = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return errorResponse(res, 401, 'Unauthorized access.');
    }

    if (roles.length && !roles.includes(req.user.role)) {
      return errorResponse(res, 403, 'Forbidden: You do not have permission to perform this action.');
    }

    next();
  };
};

module.exports = authorize;
