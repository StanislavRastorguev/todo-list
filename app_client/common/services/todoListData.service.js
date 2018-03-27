angular
  .module('todoListApp')
  .service('todoListData', todoListData);

//CRUD requests for lists
function todoListData($http) {
  let todoList =  () => {
    return $http.get('/api/lists');
  };

  let newTodoList = () => {
    return $http.post('/api/list');
  };

  let deleteTodoList = (listid) => {
    return $http.delete('/api/list/' + listid);
  };

  let updateTodoList = (listid, newName) => {
    return $http.put('/api/list/' + listid, newName);
  };

  return {
    todoList,
    newTodoList,
    deleteTodoList,
    updateTodoList
  }
}
