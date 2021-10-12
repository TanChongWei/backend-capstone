const App = require('./app')
const Router = require('./routes')
const AuthService = require('./services/auth.js')
const TodoListService = require('./services/todoList')
const TodoListTasksService = require('./services/todoListTasks')
const db = require('./db')
const AuthMiddleware = require('./middleware/authMiddleware')
require('dotenv').config()

const authService = AuthService(db)
const todoListService = {
  ...TodoListTasksService(db),
  ...TodoListService(db)
}
const authMiddleware = AuthMiddleware(authService)
const router = Router(authMiddleware, authService, todoListService)
const app = App(router)

const PORT = process.env.PORT 
app.listen(PORT, () => {
  console.log(`Listening on PORT:${PORT}`)
})
