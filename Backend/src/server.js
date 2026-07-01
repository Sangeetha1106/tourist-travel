const app = require('./app');
const connectDB = require('./config/db');
const sequelize = require('./config/sequelize');
const initializeAssociations = require('./models/initModels');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Initialize Associations
    initializeAssociations();

    // Sync database 
    // Note: use { force: true } or { alter: true } only for development
    await sequelize.sync({ alter: true });
    console.log('Database synced successfully');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();
