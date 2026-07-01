const User = require('./user.model');
const Role = require('../role/role.model');
const { hashPassword, comparePassword } = require('../../shared/utils/bcrypt');
const { generateToken } = require('../../shared/utils/jwt');

const registerUser = async (userData) => {
  const existingUser = await User.findOne({ where: { email: userData.email } });
  if (existingUser) {
    throw new Error('User already exists with this email.');
  }

  const hashedPassword = await hashPassword(userData.password);

  let customerRole = await Role.findOne({ where: { roleName: 'CUSTOMER' } });
  if (!customerRole) {
    // Fallback if roles aren't seeded yet
    customerRole = await Role.create({ roleName: 'CUSTOMER' });
  }

  const newUser = await User.create({
    ...userData,
    password: hashedPassword,
    roleId: customerRole.id
  });

  const { password, ...userWithoutPassword } = newUser.toJSON();
  return userWithoutPassword;
};

const loginUser = async (email, password) => {
  const user = await User.findOne({
    where: { email },
    include: [{ model: Role, attributes: ['roleName'] }]
  });

  if (!user) {
    throw new Error('Invalid email or password.');
  }

  if (!user.status) {
    throw new Error('Account is inactive.');
  }

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password.');
  }

  const tokenPayload = {
    id: user.id,
    email: user.email,
    role: user.Role.roleName
  };

  const token = generateToken(tokenPayload);

  // Format the user object exactly as requested
  const formattedUser = {
    id: user.id,
    name: `${user.firstName} ${user.lastName}`.trim(),
    email: user.email,
    role: user.Role.roleName
  };

  return { user: formattedUser, token };
};

const getUserProfile = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ['password'] },
    include: [{ model: Role, attributes: ['roleName'] }]
  });

  if (!user) {
    throw new Error('User not found.');
  }

  return user;
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile
};
