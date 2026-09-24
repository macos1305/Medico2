require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const app = require('./app');
const connectDB = require('./config/db');
const seedData = require('./utils/seedAdmin');

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Auto-seed admin & initial medical specializations if needed
    await seedData();

    // Start listening
    const server = app.listen(PORT, () => {
      console.log(`[Server] Medico API server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
      console.log(`[Server] Health check: http://localhost:${PORT}/api/health`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      console.error(`[Unhandled Rejection] ${err.message}`);
      server.close(() => process.exit(1));
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (err) => {
      console.error(`[Uncaught Exception] ${err.message}`);
      process.exit(1);
    });
  } catch (error) {
    console.error(`[Fatal Startup Error]: ${error.message}`);
    process.exit(1);
  }
};

startServer();
