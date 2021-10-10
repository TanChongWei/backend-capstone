const express = require('express')
const { UserFacingError } = require('../schema/error')
const { SuccessResponse } = require('../schema/response')
const TodoListTask = require('../schema/todoListTask')

module.exports = (db, accessVerificationMiddleware) => {
  const router = express.Router()

  router
    .post('/:todoListId', accessVerificationMiddleware, async(req, res, next) => {
      try {
        const {todoListId} = req.params
        const {task} = req.body
        const email = req.email
        const newTask = new TodoListTask(task)
        const updatedList = await db.addTodoListTask(todoListId, newTask)
        if (updatedList) {
          res.status(201).redirect(`/todo/${todoListId}`)
        } else {
          res.status(200).send(new SuccessResponse(200, email, [`No such list found for user : ${email}`]))
        }
      } catch (e){ 
        res.status(500).send(new UserFacingError(500, e))
      }
    })
    .put('/:todoListId/:taskId', accessVerificationMiddleware, async(req, res,next) => {
      try {
        const {todoListId, taskId} = req.params
        const email = req.email
        const {task} = req.body
        const updatedList = db.updateTodoListTask(todoListId, taskId, task)
        if (updatedList) {
          res.status(201).redirect(`/todo/${todoListId}`)
        } else {
          res.status(200).send(new SuccessResponse(200, email, `No such list found for user : ${email}`))
        }
      } catch (e) {
        res.status(500).send(new UserFacingError(500, e))
      }
    })
    .delete('/:todoListId/:taskId', accessVerificationMiddleware, async(req, res, next) => {
      try {
        const {todoListId, taskId} = req.params
        const email = req.email
        const deleted = db.deleteTodoListTask(todoListId, taskId)
        if (deleted) {
          res.status(201).redirect(`/todo/${todoListId}`)
        } else {
          res.status(200).send(new SuccessResponse(200, email, 'No such task found'))
        }
      } catch (e) {
        res.status(500).send(new UserFacingError(500, e))
      }
    })

  return router
}