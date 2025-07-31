// Get Environment.
const dotenv = require('dotenv');

dotenv.config();
/**
 * Internal Dependencies
 */
const app = require('./app');

// Create port constant.
const { PORT } = process.env;

// Listen to server.
app.listen(PORT, () => {
  console.log(`Listening at port ${PORT}...`);
});
