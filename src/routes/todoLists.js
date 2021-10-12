const express = require('express')
const { SuccessResponse } = require('../schema/response')
const { UserFacingError } = require('../schema/error')

module.exports = (service, accessVerificationMiddleware) => {
  const router = express.Router()

  router
    .post('/:todoListId/access', async(req, res, next) =>{
      try {
        const {todoListId} = req.params
        const email = req.email
        const {emails} = req.body

        const listName = await service.grantListAccess(todoListId, emails)
        return listName 
          ? res.status(201)
            .send(new SuccessResponse(201, email, [`Access for To-do List:'${listName}' granted for the following users: ${emails.join(', ')}`]))
          : res.status(404)
            .send(new UserFacingError(404, email, [`No such list found for user : ${email}`]))
      } catch (e) {
        res.status(500).send(new UserFacingError(500, e))
      }
    })
    .post('/', async(req, res, next) => {
      try {
        const email = req.email 
        const {listName, tasks} = req.body
        const newList = await service.createTodoList(listName, email, tasks)
        return res.status(201).send(new SuccessResponse(201, email, newList))
      } catch (e) {
        res.status(500).send(new UserFacingError(500, e))
      }
    })
    .get('/', async(req, res, next) => {
      try {
        const email = req.email
        const todoLists = await service.getTodoListsByEmail(email)
        return todoLists 
          ? res.status(200).send(new SuccessResponse(200, email, todoLists))
          : res.status(404).send(new UserFacingError(404, email, [`No lists found for user : ${email}`]))
        
      } catch (e) {
        res.status(500).send(new UserFacingError(500, e))
      }
    })
    .get('/:todoListId', accessVerificationMiddleware, async(req, res, next) => {
      try {
        const {todoListId} = req.params
        const email = req.email
        const newList = await service.getTodoListById(todoListId)
        return newList 
          ? res.status(201).send(new SuccessResponse(201, email, newList))
          : res.status(404).send(new UserFacingError(404, email, [`No such list found for user : ${email}`]))

      } catch (e) {
        console.log(e)
        res.status(500).send(new UserFacingError(500, e))
      }
    })
    .put('/:todoListId', accessVerificationMiddleware, async(req, res, next) => {
      try {
        const {todoListId} = req.params
        const email = req.email
        const {listName} = req.body
        const updatedList = await service.findListByIdAndUpdate(todoListId, listName)
        return updatedList 
          ? res.status(200).send(new SuccessResponse(200, email, updatedList))
          : res.status(404).send(new UserFacingError(404, email, [`No such list found for user : ${email}`]))
        
      } catch (e) {
        res.status(500).send(new UserFacingError(500, e ))
      }
    })
    .delete('/:todoListId', accessVerificationMiddleware, async(req, res, next) => {
      try {
        const {todoListId} = req.params
        const email = req.email
        const deletedList = await service.findListByIdAndDelete(todoListId)
        return deletedList 
          ? res.status(201).send(new SuccessResponse(201, email, [`Deleted Todo-list: ${deletedList.list_name} `]))
          : res.status(404).send(new UserFacingError(404, email, [`No such list found for user : ${email}`]))

      } catch (e) {
        res.status(500).send(new UserFacingError(500, e))
      }
    })
   
  return router
}