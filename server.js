const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');
// console.log(process.env.NODE_ENV);
process.on('uncaughtException', (err) => {
  console.log('Shutting down due to an uncaught exception... 💣');
  console.log(err.name, err.message);
  process.exit(1);
});
dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);
mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
process.on('unhandledRejection', (err) => {
  console.log('Shutting down due to an unhandled rejection... 💣');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
