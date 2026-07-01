// @ts-nocheck
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('travel_db', 'postgres', 'sangeetha', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false,
});

async function checkDb() {
  try {
    await sequelize.authenticate();
    const [results] = await sequelize.query('SELECT * FROM bookings ORDER BY id DESC LIMIT 5;');
    console.log('Recent bookings:', results);
    process.exit(0);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
}

checkDb();

