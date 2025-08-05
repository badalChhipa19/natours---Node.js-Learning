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
mongoose.connect(DB).then(() => {
  console.log('DB Connected...');
});

// Listen to server.
app.listen(PORT, () => {
  console.log(`Listening at port ${PORT}...`);
});
