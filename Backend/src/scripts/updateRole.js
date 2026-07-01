const sequelize = require('../config/sequelize');
const Role = require('../modules/role/role.model');

const updateRoles = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    
    const [updatedRows] = await Role.update(
      { roleName: 'TOUR_GUIDE' },
      { where: { roleName: 'GUIDE' } }
    );
    
    console.log(`Updated ${updatedRows} roles from GUIDE to TOUR_GUIDE.`);
    process.exit(0);
  } catch (error) {
    console.error('Unable to connect to the database or update roles:', error);
    process.exit(1);
  }
};

updateRoles();
