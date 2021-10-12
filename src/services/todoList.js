module.exports = (db) => {
  const TodoList = require('../schema/todolist')
  const TodoListTask = require('../schema/todoListTask')
  const service = {}

  service.grantListAccess = async(todoListId, emails) => {
    const data = (await db.findListById(todoListId))
    if (data) {
      for (const e of emails) {
        const access = await db.verifyListAccess(e, todoListId)
        if (!access) {
          await db.allowEditAccess(todoListId, e)
        }
      } 
      return data[0].list_name
    }
    return null
  }

  service.createTodoList = async(listName, email, tasks) => {
    const newList = new TodoList(listName, email, tasks)
    const listId = (await db.InsertTodoList(newList)).list_id
    const listTasks = tasks.map(task => new TodoListTask(task))

    for (const task of listTasks) {
      await db.addTodoListTask(listId, task)
    }

    newList.listId = listId
    newList.listTasks = listTasks

    return newList
  }

  service.getTodoListsByEmail = async(email) => {
    const todoListData = await db.findListsByEmail(email)

    if (todoListData) {
      const todoLists = todoListData.map(list => {
        const newList = new TodoList(list.list_name, list.author, [])
        newList.listId = list.list_id
        return newList
      })
	
      for (const list of todoLists) {
        const tasks = await db.getTodoListTasks(list.listId)
        list.listTasks = tasks.map(t => t.task)
      }
      return todoLists
    } 
    return null
  }

  service.getTodoListById = async(todoListId) => {
    const todoListData = await db.findListById(todoListId)

    if (todoListData) {
      const listTasks = todoListData.map(t => {
        const task = new TodoListTask(t.task)
        task.taskId = t.task_id
        return task
      })
      const newList = new TodoList(todoListData[0].list_name, todoListData[0].author, listTasks)
      newList.listId = todoListId
      return newList
    }
    return null
  }

  service.findListByIdAndUpdate = async(todoListId, listName) => {
    const updatedList = await db.findListByIdAndUpdate(todoListId, listName)
    return updatedList ? updatedList : null
  }

  service.findListByIdAndDelete = async(todoListId) => {
    const deletedList = await db.findListByIdAndDelete(todoListId)
    return deletedList ? deletedList : null 
  }

  return service
}
