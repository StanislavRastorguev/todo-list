const express = require('express');
const router = express.Router();
const ctrlTodoLists = require('../controllers/todoLists');
const ctrlTasks = require('../controllers/tasks');

router.get('/lists', ctrlTodoLists.readTodoLists);
router.post('/list', ctrlTodoLists.createTodoList);
router.put('/list/:listid', ctrlTodoLists.updateTodoList);
router.delete('/list/:listid', ctrlTodoLists.deleteTodoList);

router.post('/list/:listid/task', ctrlTasks.createTask);
router.put('/list/:listid/task/:taskid', ctrlTasks.updateTask);
router.put('/list/:listid/priority', ctrlTasks.updatePriority);
router.delete('/list/:listid/task/:taskid', ctrlTasks.deleteTask);

module.exports = router;