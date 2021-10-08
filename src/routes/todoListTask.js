const express = require('express')
const { UserFacingError } = require('../schema/error')
const { SuccessResponse } = require('../schema/response')
const TodoListTask = require('../schema/todoListTask')

module.exports = (db) => {
  const router = express.Router()

  router
    .post('/:id', async(req, res, next) => {
      try {
        const {id} = req.params
        const {task} = req.body
        const email = req.email
        const newTask = new TodoListTask(task)
        const updatedList = await db.addTodoListTask(id, newTask)
        if (updatedList) {
          res.status(201).send(new SuccessResponse(201, email, updatedList))
        } else {
          res.status(200).send(new SuccessResponse(200, email, `No such list found for user : ${email}`))
        }
      } catch (e){ 
        res.status(500).send(new UserFacingError(500, e))
      }
    })
    .put('/:id/:taskId', async(req, res,next) => {
      try {
        const {id, taskId} = req.params
        const email = req.email
        const {task} = req.body
        const updatedList = db.updateTodoListTask(id, taskId, task)
        if (updatedList) {
          res.status(201).send(new SuccessResponse(201, email, updatedList))
        } else {
          res.status(200).send(new SuccessResponse(200, email, `No such list found for user : ${email}`))
        }
      } catch (e) {
        res.status(500).send(new UserFacingError(500, e))
      }
    })
    .delete('/:id/:taskId', async(req, res, next) => {
      try {
        const {id, taskId} = req.params
        const email = req.email
        const deleted = db.deleteTodoListTask(id, taskId)
        if (deleted) {
          res.status(201).send(new SuccessResponse(201, email, 'Task deleted from list'))
        } else {
          res.status(200).send(new SuccessResponse(200, email, 'No such task found'))
        }
      } catch (e) {
        res.status(500).send(new UserFacingError(500, e))
      }
    })

  return router
}