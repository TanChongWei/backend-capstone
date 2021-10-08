const App = require('./app')
const Router = require('./routes')
const AuthService = require('./services/auth.js')
const db = require('./db')
const AuthMiddleware = require('./middleware/authMiddleware')
require('dotenv').config()

const authService = AuthService(db)
const authMiddleware = AuthMiddleware(authService)
const router = Router(authMiddleware, authService, db)
const app = App(router)

const PORT = process.env.PORT 
app.listen(PORT, () => {
  console.log(`Listening on PORT:${PORT}`)
})
