angular
  .module('todoListApp')
  .service('taskData', taskData);

//CRUD requests for tasks
function taskData($http) {
  let addNewTask = (listid, taskName) => {
    return $http.post(`/api/list/${listid}/task`, taskName);
  };

  let deleteTask = (listid, taskid) => {
    return $http.delete(`/api/list/${listid}/task/${taskid}`);
  };

  let updateTask = (listid, taskid, newData) => {
    return $http.put(`/api/list/${listid}/task/${taskid}`, newData)
  };

  let updatePriority = (listid, data) => {
    return $http.put(`/api/list/${listid}/priority`, data);
  };

  return {
    addNewTask,
    deleteTask,
    updateTask,
    updatePriority
  }
}