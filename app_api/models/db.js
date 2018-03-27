const mongoose = require('mongoose');
const dbURI = 'mongodb://localhost/todo_list_mean';
mongoose.connect(dbURI);

const db = mongoose.connection;

db.on('error', (err) => {
  console.log('Mongoose connection error: ' + err);
});
db.on('connected', () => {
  console.log('Mongoose connected to ' + dbURI);
});
db.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

require('./todoList');