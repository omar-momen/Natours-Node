import { config } from 'dotenv';
config({ path: './config.env' });

import mongoose from 'mongoose';
const DB = process.env.DB_CONNECTION_STRING.replace(
  '<db_password>',
  process.env.DATABASE_PASSWORD,
);
await mongoose.connect(DB);

import fs from 'fs';
const tours = JSON.parse(fs.readFileSync(`${import.meta.dirname}/tours.json`));

import Tour from '../../models/tour.js';

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('data successfully loaded');
  } catch (err) {
    console.log(err);
  }
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('data successfully deleted');
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '--delete') {
  await deleteData();
  process.exit();
} else if (process.argv[2] === '--import') {
  await importData();
  process.exit();
}
