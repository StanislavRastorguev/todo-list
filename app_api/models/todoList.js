const mongoose = require('mongoose');

let taskSchema = new mongoose.Schema({
  taskName: {type: String, required: true},
  status: {type: Boolean, "default": false},
  priority: {type: Number, "default": 0}
});

let todoListSchema = new mongoose.Schema({
  name: {type: String, "default": "new todo list"},
  tasks: [taskSchema]
});

mongoose.model('TodoList', todoListSchema);