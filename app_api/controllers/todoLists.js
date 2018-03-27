const mongoose = require('mongoose');
const TodoList = mongoose.model('TodoList');

//response to client side
let sendJsonResponse = (res, status, content) => {
  res.status(status);
  res.json(content);
};

//get data of lists from mongoDB
module.exports.readTodoLists = (req, res) => {
  TodoList.find()
    .exec((err, lists) => {
      if (!lists) {
        sendJsonResponse(res, 404, {
          "message": "No todo lists"
        });
      } else if (err) {
        sendJsonResponse(res, 404, err);
        return;
      }
      sendJsonResponse(res, 200, lists);
    });
};

//create list and write to mongoDB
module.exports.createTodoList = (req, res) => {
  TodoList.create({
    name: "new todo list",
    tasks: []
  }, (err, lists) => {
    if (err) {
      sendJsonResponse(res, 404, err);
    } else {
      sendJsonResponse(res, 201, lists);
    }
  });
};

//update list name and write to mongoDB
module.exports.updateTodoList = (req, res) => {
  if (!req.params.listid) {
    sendJsonResponse(res, 404, {
      "message": "Todo list not found"
    });
    return;
  }
  TodoList.findById(req.params.listid)
    .exec((err, list) => {
      if (!list) {
        sendJsonResponse(res, 404, {
          "message": "Todo list not found"
        });
        return;
      } else if (err) {
        sendJsonResponse(res, 404, err);
        return;
      }
      list.name = req.body.name;
      list.save((err, list) => {
        if (err) {
          sendJsonResponse(res, 404, err);
        } else {
          sendJsonResponse(res, 200, list);
        }
      });
    });
};

//delete list from mongoDB
module.exports.deleteTodoList = (req, res) => {
  let listid = req.params.listid;
  if (listid) {
    TodoList.findByIdAndRemove(listid)
      .exec((err) => {
        if (err) {
          sendJsonResponse(res, 404, err);
          return;
        }
        sendJsonResponse(res, 204, null);
      });
  } else {
    sendJsonResponse(res, 404, {
      "message": "list not found"
    });
  }
};