/* eslint-disable no-undef */
const TodoListTasksService = require('../../../src/services/todoListTasks')
const {db} = require('../mocks/mocks')
	
const todoListTasksService = TodoListTasksService(db)

describe('Creating new todo list tasks', () => {
  afterEach(() => {
    for (const method in db) {
      db[method].mockClear()
    }
  })
  describe('Given a valid todo list id and a new task', () => {
    it('Should return the list updated with the new task', async () => {
      const expected = {
        todo_list_id:1,
        task:'test-task',
        completed: false,
        deleted: false
      }
      db.addTodoListTask.mockResolvedValueOnce({
        todo_list_id:1,
        task:'test-task',
        completed: false,
        deleted: false
      })
      const newTask = await todoListTasksService.addTodoListTask(1, 'test-task')
      expect(db.addTodoListTask).toBeCalled()
      expect(newTask).toEqual(expected)
    })
  })

  describe('Given an invalid todo list id', () => {
    it('Should return null', async () => {
      db.addTodoListTask.mockResolvedValueOnce(null)
      const newTask = await todoListTasksService.addTodoListTask(23.59, 'test-task')
      expect(newTask).toBeNull()
    })
  })
})

describe('Updating current todo list tasks', () => {
  afterEach(() => {
    for (const method in db) {
      db[method].mockClear()
    }
  })
  describe('Given a valid todo list id, task id and task', () => {
    it('Should return the updated todo list task', async () => {
      const expected = {
        todo_list_id:1,
        task_id:1,
        task:'updated-test-task-1',
        completed: false,
        deleted: false
      }
      const updatedTask = await todoListTasksService.updateTodoListTask(1, 1, 'updated-test-task-1')
      expect(db.updateTodoListTask).toBeCalled()
      expect(updatedTask).toEqual(expected)
    })
  })
  describe('Given an invalid todo list id', () => {
    it('Should return null', async () => {
      db.updateTodoListTask.mockResolvedValueOnce(null)
      const updatedTask = await todoListTasksService.updateTodoListTask(23.599, 1, 'updated-test-task-1')
      expect(updatedTask).toBeNull()
    })
  })
})

describe('Deleting todo list task', () => {
  afterEach(() => {
    for (const method in db) {
      db[method].mockClear()
    }
  })
  describe('Given a valid todo list id and task id or if task has already been deleted', () => {
    it('Should return the deleted task', async () => {
      const expected = {
        todo_list_id:1,
        task:'updated-test-task-1',
        completed: false,
        deleted: true
      }
      const deletedTask = await todoListTasksService.deleteTodoListTask(1, 1)
      expect(db.deleteTodoListTask).toBeCalled()
      expect(deletedTask).toEqual(expected)
    })
  })
	
  describe('Given an invalid todo list id and/or list task id', () => {
    it('Should return null', async () => {
      db.deleteTodoListTask.mockResolvedValueOnce(null)
      const deletedTask = await todoListTasksService.deleteTodoListTask(23.59, 1)
      expect(deletedTask).toBeNull()
    })
  })
})