const mongoose = require('mongoose');
const TodoList = mongoose.model('TodoList');

let sendJsonResponse = (res, status, content) => {
  res.status(status);
  res.json(content);
};

//create task and write to mongoDB
module.exports.createTask = (req, res) => {
  let todoListId = req.params.listid;
  if (todoListId) {
    TodoList.findById(todoListId)
      .select('tasks')
      .exec((err, list) => {
        if (err) {
          sendJsonResponse(res, 400, err);
        } else {
          //send to doAddTask array of tasks and list id
          doAddTask(req, res, list);
        }
      });
  } else {
    sendJsonResponse(res, 404, {
      "message": "Not found todo list"
    });
  }
};

let doAddTask = (req, res, list) => {
  let arrForName = req.body.taskName.split(' ');
  for (let i = 0; i < arrForName.length; i++){
    if (arrForName[i].length > 35) {
      sendJsonResponse(res, 404, {
        "message": "You can not enter a task with a word longer than 35 characters"
      });
      return;
    }
  }
  if (!list) {
    sendJsonResponse(res, 404, {
      "message": "todo list not found"
    });
  } else {
    //add new task
    list.tasks.unshift({
      taskName: req.body.taskName
    });
    //update tasks priority
    updatePriority(list.tasks);
    //save new array of tasks
    list.save((err, list) => {
      if (err) {
        sendJsonResponse(res, 404, err);
      } else {
        sendJsonResponse(res, 201, list);
      }
    });
  }
};

let updatePriority = (tasks) => {
  for(let i = 0; i < tasks.length; i++) {
    tasks[i].priority = i;
  }
};

//update task and write to mongoDB
module.exports.updateTask = (req, res) => {
  let arrForName = req.body.taskName.split(' ');
  for (let i = 0; i < arrForName.length; i++){
    if (arrForName[i].length > 35) {
      sendJsonResponse(res, 404, {
        "message": "You can not enter a task with a word longer than 35 characters"
      });
      return;
    }
  }
  if (!req.params.listid || !req.params.taskid) {
    sendJsonResponse(res, 404, {
      "message": "list or task is not found"
    });
    return;
  }
  TodoList.findById(req.params.listid)
    .select('tasks')
    .exec((err, list) => {
      let taskForUpgrade;
      if (!list) {
        sendJsonResponse(res, 404, {
          "message": "list is not found"
        });
        return;
      } else if (err) {
        sendJsonResponse(res, 404, err);
        return;
      }
      if (list.tasks && list.tasks.length > 0) {
        //find sub-document by id in array of tasks
        taskForUpgrade = list.tasks.id(req.params.taskid);
        if (!taskForUpgrade) {
          sendJsonResponse(res, 404, {
            "message": "task not found"
          });
        } else {
          //update task data
          taskForUpgrade.taskName = req.body.taskName;
          taskForUpgrade.status = req.body.status;
          taskForUpgrade.priority = req.body.priority;
          list.save((err, list) => {
            if (err) {
              sendJsonResponse(res, 404, err);
            } else {
              sendJsonResponse(res, 200, list)
            }
          });
        }
      } else {
        sendJsonResponse(res, 404, {
          "message": "task not found"
        });
      }
  });
};

//delete task from mongoDB
module.exports.deleteTask = (req, res) => {
  if (!req.params.listid || !req. params.taskid) {
    sendJsonResponse(res, 404, {
      "message": "list or task is not found"
    });
    return;
  }

  TodoList.findById(req.params.listid)
    .select('tasks')
    .exec((err, list) => {
      if (!list) {
        sendJsonResponse(res, 404, {
          "message": "list is not found"
        });
        return
      } else if (err) {
        sendJsonResponse(res, 404, err);
        return;
      }
      if (list.tasks && list.tasks.length > 0) {
        //check if sub-document does not exist
        if (!list.tasks.id(req.params.taskid)) {
          sendJsonResponse(res, 404, {
            "message": "task not found"
          });
        } else {
          //find sub-document by id in array of tasks and remove
          list.tasks.id(req.params.taskid).remove();
          updatePriority(list.tasks);
          list.save((err) => {
            if (err) {
              sendJsonResponse(res, 404, err);
            } else {
              sendJsonResponse(res, 204, null);
            }
          });
        }
      } else {
        sendJsonResponse(res, 404, {
          "message": "task not found"
        });
      }
    });
};

//update priority of tasks and write to mongoDB
module.exports.updatePriority = (req, res) => {
  //parse request data
  let todoListId = req.params.listid,
    arr = req.body.data.tasks,
    thisIndex = req.body.thisTask.priority,
    newIndex = req.body.newTask.priority,
    thisTask = req.body.thisTask;

  //swap tasks
  if (arr && thisTask && req.body.newTask){
    arr.splice(thisIndex, 1);
    arr.splice(newIndex, 0, thisTask);
    //update priority for tasks
    updatePriority(arr);
  } else {
    sendJsonResponse(res, 404, {
      "message": "Not enough data"
    });
    return;
  }
  if (todoListId) {
    TodoList.findById(todoListId)
      .select('tasks')
      .exec((err, list) => {
        if (err) {
          sendJsonResponse(res, 400, err);
        } else {
          //remove all tasks and write new
          list.tasks.splice(0, list.tasks.length);
          for (let i = 0; i < arr.length; i++) {
            list.tasks.push(arr[i]);
          }
          //save new array of tasks in list
          list.save((err, list) => {
            if (err) {
              sendJsonResponse(res, 404, err);
            } else {
              sendJsonResponse(res, 201, list);
            }
          });
        }
      });
  } else {
    sendJsonResponse(res, 404, {
      "message": "Not found todo list"
    });
  }
};
