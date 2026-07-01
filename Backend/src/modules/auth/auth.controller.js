const authService = require('./auth.service');
const { successResponse } = require('../../shared/utils/response');

const register = async (req, res, next) => {
  try {
    const user = await authService.registerUser(req.body);
    return successResponse(res, 201, 'User registered successfully', user);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const data = await authService.loginUser(email, password);
    return successResponse(res, 200, 'Login successful', data);
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await authService.getUserProfile(userId);
    return successResponse(res, 200, 'Profile fetched successfully', user);
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    // Just a placeholder since JWT is stateless.
    // If you had redis or blacklisting, you'd invalidate the token here.
    return successResponse(res, 200, 'Logged out successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile,
  logout
};
