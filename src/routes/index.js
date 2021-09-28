const express = require('express')

module.exports = (authService,db) => {
  const router = express.Router()

  router.get('/', (req, res, next) => {
    console.log(req.headers.authorization)
    res.send('Todo List Backend Service')
  })
  router.use('/', require('./auth')(authService))
  router.use('/todo', require('./todoLists')(db))

  return router
}