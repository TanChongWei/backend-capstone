module.exports = (db) => {
  const TodoListTask = require('../schema/todoListTask')
  const service = {}

  service.addTodoListTask = async(todoListId, t) => {
    const task = new TodoListTask(t)
    const newTask = await db.addTodoListTask(todoListId, task)
    return newTask ? newTask : null
  }

  service.updateTodoListTask = async(todoListId, taskId, task) => {
    const updatedTask = await db.updateTodoListTask(todoListId, taskId, task)
    return updatedTask ? updatedTask : null
  }

  service.deleteTodoListTask = async(todoListId, taskId) => {
    const deletedTask = await db.deleteTodoListTask(todoListId, taskId)
    return deletedTask ? deletedTask : null
  }

  return service
}


