const sequelize = require('../config/sequelize');
const User = require('../modules/auth/user.model');
const Role = require('../modules/role/role.model');

const fetchUsers = async () => {
  try {
    await sequelize.authenticate();
    const users = await User.findAll({
      include: [Role]
    });
    
    users.forEach(user => {
      console.log(`Role: ${user.Role.roleName.padEnd(15)} Email: ${user.email.padEnd(25)} Password: password123`);
    });
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

fetchUsers();
