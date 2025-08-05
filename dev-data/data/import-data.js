const dotenv = require('dotenv');
const mongoose = require('mongoose');
const fs = require('fs');
const Tour = require('../../models/toursModel');

dotenv.config('../../.env');
console.log('COnfigured...');

const { DB_PASSWORD } = process.env;
const DB = process.env.DB.replace('<DB_PASSWORD>', DB_PASSWORD);
mongoose.connect(DB).then(() => console.log('DB connected....'));

const tour = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'),
);

const importData = async () => {
  try {
    await Tour.create(tour);
    console.log('Data entered...');
  } catch (err) {
    console.log('Inserting Error');
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('DB Cleared...');
  } catch (err) {
    console.log('Deletion fail');
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
