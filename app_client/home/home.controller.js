angular.module('todoListApp')
  .controller('homeCtrl', homeCtrl);

function homeCtrl (todoListData, taskData) {
  let vm = this;

  vm.pageHeader = {
    title: "SIMPLE TODO LISTS",
    description: "Project for training on MEAN stack"
  };

  //get lists data
  vm.getData = () => {
    //send request to service todoListData
    todoListData.todoList()
      .then((todoListsData) => {
        vm.message = '';
        //write to the vm.data.result array of lists
        vm.data = {
          result: todoListsData.data
        };
      })
      .catch((err) => {
        vm.message = `Sorry, something's gone wrong, ${err.status} ${err.statusText}`;
      })
  };
  vm.getData();

  //create new list
  vm.newList = () => {
    //send request to service todoListData
    todoListData.newTodoList()
      .then((newListData) => {
        vm.message = '';
        //push new list to the array vm.data.result
        vm.data.result.push(newListData.data);
      })
      .catch((err) => {
        vm.message = `Sorry, something's gone wrong, ${err.status} ${err.statusText}`;
      })
  };

  //delete list
  vm.deleteList = (index) => {
    let listid = vm.data.result[index]._id;
    //send request to service todoListData
    todoListData.deleteTodoList(listid)
      .then(() => {
        vm.message = '';
        //delete list from the array vm.data.result
        vm.data.result.splice(index, 1);
      })
      .catch((err) => {
        vm.message = `Sorry, something's gone wrong, ${err.status} ${err.statusText}`;
      })
  };

  //change list name
  vm.updateList = (listData) => {
    let { name } = listData;
    //parse data from listData
    const { data: {name: oldName, _id: listid}, index } = listData;
    if (name === undefined || name === '') {
      name = oldName;
    }
    if (name.length > 30) {
      vm.message = "Very long name, enter shorter";
      return;
    }
    //send request to service todoListData
    todoListData.updateTodoList(listid, {name: name})
      .then((updatedListData) => {
        vm.message = '';
        //replace list
        vm.data.result.splice(index, 1, updatedListData.data);
      })
      .catch((err) => {
        vm.message = `Sorry, something's gone wrong, ${err.status} ${err.statusText}`;
      })
  };

  //create new task
  vm.newTask = (newTaskData) => {
    //parse newTaskData
    let { id: listid, result: { tasks }, taskName } = newTaskData;
    if (!taskName) {
      vm.message = "Enter task name";
      return;
    }
    let arrForName = taskName.split(' ');
    for (let i = 0; i < arrForName.length; i++){
      if (arrForName[i].length > 35) {
        vm.message = "You can not enter a task with a word longer than 35 characters";
        return;
      }
    }
    //send request to service taskData
    taskData.addNewTask(listid, {taskName: taskName})
      .then((newTasksData) => {
        vm.message = '';
        //replace tasks
        let newArr = newTasksData.data.tasks;
        tasks.splice(0, tasks.length);
        for (let i = 0; i < newArr.length; i++) {
          tasks.push(newArr[i]);
        }
      })
      .catch((err) => {
        vm.message = `Sorry, something's gone wrong, ${err.status} ${err.statusText}`;
      })
  };

  //delete task
  vm.deleteTask = (taskForDelete) => {
    const { index, result: { tasks, _id : listid }, taskid } = taskForDelete;
    //send request to service taskData
    taskData.deleteTask(listid, taskid)
      .then(() => {
        vm.message = '';
        //replace tasks
        let oldArr = tasks, newArr = oldArr.slice(0);
        newArr.splice(index, 1);
        oldArr.splice(0, oldArr.length);
        for (let i = 0; i < newArr.length; i++) {
          newArr[i].priority = i;
          oldArr.push(newArr[i]);
        }
      })
      .catch((err) => {
        vm.message = `Sorry, something's gone wrong, ${err.status} ${err.statusText}`;
      })
  };

  //update task
  vm.updateTask = (dataForUpdate) => {
    let { data : { tasks, _id: listid }, index, newTaskName } = dataForUpdate;
    if (newTaskName === undefined || newTaskName === '') {
      newTaskName = tasks[index].taskName;
    }
    let taskid = tasks[index]._id,
      //create object for update
      newData = {
        taskName: newTaskName,
        status: tasks[index].status,
        priority: tasks[index].priority
      };
    let arrForName = newTaskName.split(' ');
    for (let i = 0; i < arrForName.length; i++){
      if (arrForName[i].length > 35) {
        vm.message = "You can not enter a task with a word longer than 35 characters";
        return;
      }
    }
    //send request to service taskData
    taskData.updateTask(listid, taskid, newData)
      .then((updatedList) => {
        vm.message = '';
        //replace task
        let newTask = updatedList.data.tasks[index];
        tasks.splice(index, 1, newTask);
      })
      .catch((err) => {
        vm.message = `Sorry, something's gone wrong, ${err.status} ${err.statusText}`;
      })
  };

  //change task status
  vm.changeStatus = (listDataForUpdate) => {
    let { data, index } = listDataForUpdate;
    data.tasks[index].status = !data.tasks[index].status;
    //create object for update task
    let updateStatus = {
      data: data,
      index: index,
      newTaskName: data.tasks[index].taskName
    };
    //call the function to update the task
    vm.updateTask(updateStatus);
  };

  //update tasks priority
  vm.changePriority = (listDataForUpdate) => {
    let listid = listDataForUpdate.data._id;
    //send request to service taskData
    taskData.updatePriority(listid, listDataForUpdate)
      .then((result) => {
        vm.message = '';
        //replace tasks in list
        let oldArr = listDataForUpdate.data.tasks,
          newArr = result.data.tasks;
        oldArr.splice(0, oldArr.length);
        for (let i = 0; i < newArr.length; i++) {
          oldArr.push(newArr[i]);
        }
      })
      .catch((err) => {
        vm.message = `Sorry, something's gone wrong, ${err.status} ${err.statusText}`;
      })
  }
}