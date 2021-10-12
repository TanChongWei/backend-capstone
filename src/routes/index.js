const express = require('express')
const authRouter = require('./auth')
const todoListRouter = require('./todoLists')
const todoListTaskRouter = require('./todoListTask')
const {NotFoundError} = require('../schema/error')

module.exports = (authMiddleware, authService, todoListService) => {
  const router = express.Router()

  router.get('/', (req, res, next) => {
    res.send('Todo List Backend Service')
  })
  router.use('/', authRouter(authService))

  // All endpoints after this will be authenticated
  router.use(authMiddleware.verifyAuthStatus)
  router.use('/todo', todoListRouter(todoListService, authMiddleware.verifyListAccessPermissions))
  router.use('/todo', todoListTaskRouter(todoListService, authMiddleware.verifyListAccessPermissions))

  // Catch all other endpoints
  router.all('*', (req, res) => {
    res.status(404).send(new NotFoundError(404, 'Invalid endpoint'))
  })

  return router
}