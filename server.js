/**
 * Internal Dependencies
 */
const app = require('./app');

// Create port constant.
const PORT = 3000;

// Listen to server.
app.listen(PORT, () => {
  console.log(`Listening at poart ${PORT}...`);
});
