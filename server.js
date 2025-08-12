// Get Environment.
const dotenv = require('dotenv');
const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exitCode = 1;
  process.exit();
});

dotenv.config();
/**
 * Internal Dependencies
 */
const app = require('./app');

// Create port constant.
const { PORT, DB_PASSWORD } = process.env;
const DB = process.env.DB.replace('<DB_PASSWORD>', DB_PASSWORD);

// Connect with DB.
mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('DB Connected...');
    console.log('\x1b[0m');
  });

// Listen to server.
const server = app.listen(PORT, () => {
  console.log('\x1b[34m');
  console.log(`Listening at port ${PORT}...`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);

  server.close(() => {
    process.exit(1);
  });
});
