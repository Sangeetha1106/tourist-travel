// @ts-nocheck
const sequelize = require('./src/config/sequelize');
const User = require('./src/modules/auth/user.model');
const Role = require('./src/modules/role/role.model');

async function test() {
  Role.hasMany(User, { foreignKey: 'roleId' });
  User.belongsTo(Role, { foreignKey: 'roleId' });

  const users = await User.findAll({ include: [Role] });
  console.log("Users and their roles:");
  users.forEach(u => {
    console.log(u.email, '->', u.Role ? u.Role.roleName : 'NO ROLE');
  });
  
  process.exit();
}

test();

