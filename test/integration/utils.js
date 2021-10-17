require('dotenv').config({path:'.env.test'})
const App = require('../../src/app')
const Router = require('../../src/routes')
const AuthMiddleware = require('../../src/middleware/authMiddleware')
const AmqpService = require('../../src/services/amqpService')
const TodoListService = require('../../src/services/todoList')
const TodoListTasksService = require('../../src/services/todoListTasks')
const AuthService = require('../../src/services/auth')
const db = require('../../src/db')

const authService = AuthService(db)
const todoListService = {
  ...TodoListTasksService(db),
  ...TodoListService(db),
  ...AmqpService()
}
const authMiddleware = AuthMiddleware(authService)
const router = Router(authMiddleware, authService, todoListService)
const app = App(router)

// set-up required utils for integration tests
const utils = {}
utils.app = app
utils.db = db

utils.setup = async () => {
  await db.initialise()
  await db.resetDb()
}

utils.teardown = async () => {
  await db.end()
}

module.exports = utils