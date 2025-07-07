import { config } from 'dotenv';
config({ path: './config.env' });

process.on('uncaughtException', (err) => {
  console.log('uncaughtException! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

import app from './app.js';

import mongoose from 'mongoose';
const DB = process.env.DB_CONNECTION_STRING.replace(
  '<db_password>',
  process.env.DATABASE_PASSWORD,
);

await mongoose.connect(DB);
console.log('DB connection successful!');

const port = process.env.PORT || 3000;
let server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log('unhandledRejection! 💥 Shutting down...');
  console.log(err.name, err.message);
  if (server)
    server.close(() => {
      process.exit(1);
    });
});
