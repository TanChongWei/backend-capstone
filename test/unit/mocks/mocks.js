/* eslint-disable no-undef */
require('dotenv').config()
const bcrypt = require('bcrypt')
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS)

const email = 'test@email.com'
const password = 'test_password'
const db = {
  findListById: jest.fn(async () => {
    return [
      {
        list_id:1,
        list_name:'test-list',
        author: email,
        task_id:1,
        task:'test-task-1',
        completed: false,
        deleted: false
      }, 
      {
        list_id:1,
        list_name:'test-list',
        author: email,
        task_id:2,
        task:'test-task-2',
        completed: false,
        deleted: false
      }]
  }),
  findListsByEmail: jest.fn(async () => {
    return [
      {
        list_id:1,
        list_name:'test-list',
        author: email,
        deleted: false
      }, 
      {
        list_id:2,
        list_name:'test-list-2',
        author: email,
        deleted: false
      }]
  }),
  InsertTodoList: jest.fn(async () => {
    return {
      list_id: 1
    }
  }),
  findListByIdAndUpdate: jest.fn(async (id, updatedName) => {
    return {
      list_id: 1,
      list_name: updatedName,
      author: email,
      deleted: false
    }
  }),
  findListByIdAndDelete: jest.fn(async () => {
    return {
      list_id:1,
      list_name:'updated-test-list',
      author: email,
      deleted: true
    }
  }),
  verifyListAccess: jest.fn(async () => {
    return true
  }),
  allowEditAccess: jest.fn(async () => {
    return {
      list_name:'test-list',
    }
  }),
  addTodoListTask: jest.fn(async (id, task) => {
    return {
      todo_list_id:1,
      task:task,
      completed: false,
      deleted: false
    }
  }),
  getTodoListTasks: jest.fn(async () => {
    return [
      {
        todo_list_id:1,
        task:'test-task-1',
        completed: false,
        deleted: false
      },
      {
        todo_list_id:2,
        task:'test-task-2',
        completed: false,
        deleted: false
      }
    ]
  }),
  updateTodoListTask: jest.fn(async (todoListId, taskId, task) => {
    return {
      todo_list_id:1,
      task_id:1,
      task:task,
      completed: false,
      deleted: false
    }
  }),
  deleteTodoListTask: jest.fn(async () => {
    return {
      todo_list_id:1,
      task:'updated-test-task-1',
      completed: false,
      deleted: true
    }
  }),

  findUserByEmail: jest.fn(async () => {
    return {
      user_id: 1,
      email: email,
      password_hash: await bcrypt.hash(password, SALT_ROUNDS)
    }
  }),
  insertUser: jest.fn(async () =>{
    return {
      user_id: 1,
      email: email,
      password_hash: await bcrypt.hash(password, SALT_ROUNDS)
    }
  })
}

module.exports = {
  email,
  password,
  db
}