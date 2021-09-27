const App = require('./app')
const Router = require('./routes')
const AuthService = require('./services/auth.js')
const db = require('./db')
require('dotenv').config()

const authService = AuthService(db)
const router = Router(authService)
const app = App(router)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Listening on PORT:${PORT}`)
})
