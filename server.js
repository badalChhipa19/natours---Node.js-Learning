// Get Environment.
const dotenv = require('dotenv');
const mongoose = require('mongoose');

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
app.listen(PORT, () => {
  console.log('\x1b[34m');
  console.log(`Listening at port ${PORT}...`);
});
