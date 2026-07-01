// @ts-nocheck
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('travel_db', 'postgres', 'sangeetha', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false,
});

async function fixDb() {
  try {
    await sequelize.authenticate();
    // find guide
    try {
      await sequelize.query(`ALTER TABLE notifications ADD COLUMN "bookingId" VARCHAR(255);`);
      console.log('Added bookingId to notifications table');
    } catch (err) {
      console.log('Column might already exist:', err.message);
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixDb();

