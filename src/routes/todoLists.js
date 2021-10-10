const express = require('express')
const TodoList = require('../schema/todolist')
const TodoListTask = require('../schema/todoListTask')
const { SuccessResponse } = require('../schema/response')
const { UserFacingError } = require('../schema/error')

module.exports = (db, accessVerificationMiddleware) => {
  const router = express.Router()

  router
    .post('/:todoListId/access', async(req, res, next) =>{
      try {
        const {todoListId} = req.params
        const email = req.email
        const {emails} = req.body
        const listName = (await db.findListById(todoListId))[0].list_name
        for (const e of emails) {
          const access = await db.verifyListAccess(e, todoListId)
          if (!access) {
            await db.allowEditAccess(todoListId, e)
          }
        }
        res.status(201).send(new SuccessResponse(201, email, 
          [`Access for To-do List:'${listName}' granted for the following users: ${emails.join(', ')}`])
        )
      } catch (e) {
        res.status(500).send(new UserFacingError(500, e))
      }
    })
    .post('/', async(req, res, next) => {
      try {
        const email = req.email 
        const {listName, tasks} = req.body
        const newList = new TodoList(listName, email, tasks)
        const listId = (await db.InsertTodoList(newList)).list_id
        const listTasks = tasks.map(task => new TodoListTask(task))

        for (const task of listTasks) {
          await db.addTodoListTask(listId, task)
        }

        newList.listId = listId
        newList.listTasks = listTasks

        res.status(201).send(new SuccessResponse(201, email, newList))
      } catch (e) {
        res.status(500).send(new UserFacingError(500, e))
      }
    })
    .get('/', async(req, res, next) => {
      try {
        const email = req.email
        const todoListData = await db.findListsByEmail(email)

        if (todoListData) {
          const todoLists = todoListData.map(list => {
            const newList = new TodoList(list.list_name, list.author, [])
            newList.listId = list.list_id
            return newList
          })
    
          for (const list of todoLists) {
            console.log(list.listId)
            const tasks = await db.getTodoListTasks(list.listId)
            list.listTasks = tasks.map(t => t.task)
          }
          res.status(200).send(new SuccessResponse(200, email, todoLists))
        } else {
          res.status(200).send(new SuccessResponse(200, email, [`No lists found for user : ${email}`]))
        }
  
      } catch (e) {
        res.status(500).send(new UserFacingError(500, e))
      }
    })
    .get('/:todoListId', accessVerificationMiddleware, async(req, res, next) => {
      try {
        const {todoListId} = req.params
        const email = req.email
        console.log('in here!')
        const todoListData = await db.findListById(todoListId)

        if (todoListData) {
          const listTasks = todoListData.map(t => {
            const task = new TodoListTask(t.task)
            task.taskId = t.task_id
            return task
          })

          const newList = new TodoList(todoListData[0].list_name, todoListData[0].author, listTasks)
          newList.listId = todoListId
          res.status(201).send(new SuccessResponse(201, email, newList))
        } else {
          res.status(200).send(new SuccessResponse(200, email, [`No such list found for user : ${email}`]))
        }

      } catch (e) {
        console.log(e)
        res.status(500).send(new UserFacingError(500, e))
      }
    })
    .put('/:todoListId', accessVerificationMiddleware, async(req, res,next) => {
      try {
        const {todoListId} = req.params
        const email = req.email
        const {listName} = req.body
        const updatedList = await db.findListByIdAndUpdate(todoListId, listName)
        if (updatedList) {
          res.status(200).send(new SuccessResponse(200, email, updatedList))
        } else {
          res.status(200).send(new SuccessResponse(200, email, [`No such list found for user : ${email}`]))
        }
      } catch (e) {
        res.status(500).send(new UserFacingError(500, e ))
      }
    })
    .delete('/:todoListId', accessVerificationMiddleware, async(req, res, next) => {
      try {
        const {todoListId} = req.params
        const email = req.email
        const deletedList = await db.findListByIdAndDelete(todoListId)
        if (deletedList) {
          res.status(201).send(new SuccessResponse(201, email, [`Deleted Todo-list: ${deletedList.list_name} `]))
        } else {
          res.status(200).send(new SuccessResponse(200, email, [`No such list found for user : ${email}`]))
        }
      } catch (e) {
        res.status(500).send(new UserFacingError(500, e))
      }
    })
   
  return router
}