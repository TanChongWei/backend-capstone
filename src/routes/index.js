const express = require('express')

module.exports = (authService) => {
  const router = express.Router()

  router.get('/', (req, res, next) => {
    res.send('Todo List Backend Service')
  })
  router.use('/', require('./auth')(authService))

  return router
}