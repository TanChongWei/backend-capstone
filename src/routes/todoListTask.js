module.exports = (service, accessVerificationMiddleware) => {
  const express = require('express')
  const { UserFacingError } = require('../schema/error')
  const { SuccessResponse } = require('../schema/response')
  const router = express.Router()

  router
    .post('/:todoListId', accessVerificationMiddleware, async(req, res, next) => {
      try {
        const {todoListId} = req.params
        const {task} = req.body
        const email = req.email
        const newTask = await service.addTodoListTask(todoListId, task)
        return newTask 
          ? res.status(201).send(new SuccessResponse(201, email, [`list task added - ${newTask.task}`]))
          : res.status(404).send(new UserFacingError(404, email, [`No such list found for user : ${email}`]))
      
      } catch (e) { 
        res.status(500).send(new UserFacingError(500, e))
      }
    })
    .put('/:todoListId/:taskId', accessVerificationMiddleware, async(req, res,next) => {
      try {
        const {todoListId, taskId} = req.params
        const email = req.email
        const {task} = req.body
        const updatedTask = await service.updateTodoListTask(todoListId, taskId, task)
        return updatedTask 
          ? res.status(201).send(new SuccessResponse(201, email, [`list task updated - ${updatedTask.task}`]))
          : res.status(404).send(new UserFacingError(404, email, `No such list/task found for user : ${email}`))

      } catch (e) {
        res.status(500).send(new UserFacingError(500, e))
      }
    })
    .delete('/:todoListId/:taskId', accessVerificationMiddleware, async(req, res, next) => {
      try {
        const {todoListId, taskId} = req.params
        const email = req.email
        const deletedTask = await service.deleteTodoListTask(todoListId, taskId)
        return deletedTask 
          ? res.status(201).send(new SuccessResponse(201, email, [`list deleted - ${deletedTask.task}`]))
          : res.status(404).send(new UserFacingError(404, email, 'No such task found'))

      } catch (e) {
        res.status(500).send(new UserFacingError(500, e))
      }
    })

  return router
}