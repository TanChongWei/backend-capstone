const express = require('express')
const TodoList = require('../schema/todolist')
const TodoListTask = require('../schema/todoListTask')
const { SuccessResponse } = require('../schema/response')
const { UserFacingError } = require('../schema/error')

module.exports = (db) => {
  const router = express.Router()

  router
  //done
    .get('/', async(req, res, next) => {
      try {
        const email = req.email
        const todoListData = await db.findListsByEmail(email)
        const todoLists = todoListData.map(list => {
          const newList = new TodoList(list.list_name, list.author, ['tasks'])
          newList.listId = list.list_id
          return newList
        })

        for (const list of todoLists) {
          const tasks = await db.getTodoListTasks(list.listId)
          list.listTasks = tasks.map(t => t.task)
        }

        res.status(200).send(new SuccessResponse(200, email, todoLists))
      } catch (e) {
        res.status(500).send(new UserFacingError(500, e))
      }
    })
    //done
    .post('/', async(req, res, next) => {
      try {
        const email = req.email 
        const {listName, tasks} = req.body
        const todoList = await db.InsertTodoList(new TodoList(listName, email, tasks))
        const listTasks = tasks.map(task => new TodoListTask(task))
        listTasks.forEach(async(task) => {
          try {
            await db.addTodoListItem(todoList.list_id, task)
          } catch (e) {
            console.log(e)
          }
        })
        res.status(201).send(new SuccessResponse(201, email, new TodoList(listName, email, listTasks)))
      } catch (e) {
        res.status(500).send(new UserFacingError(500, e))
      }
    })
    .get('/:id', async(req, res, next) => {
      try {
        const {id} = req.params
        const email = req.email
        const foundList = await db.findListById(id, email)
        if (foundList) {
          res.status(201).send(new SuccessResponse(201, email, foundList))
        } else {
          res.status(200).send(new SuccessResponse(200, email, `No such list found for user : ${email}`))
        }
      } catch (e) {
        res.status(500).send(new UserFacingError(500, e))
      }
    })
    .put('/:id', async(req, res,next) => {
      try {
        const {id} = req.params
        const email = req.email
        const {name, tasks} = req.body
        const updatedList = await db.findListByIdAndUpdate(id, email, name, tasks)
        if (updatedList) {
          res.status(200).send(new SuccessResponse(200, email, updatedList))
        } else {
          res.status(200).send(new SuccessResponse(200, email, `No such list found for user : ${email}`))
        }
      } catch (e) {
        res.status(500).send(new UserFacingError(500, e))
      }
    })
    .delete('/:id', async(req, res, next) => {
      try {
        const {id} = req.params
        const email = req.email
        const deletedList = await db.findListByIdAndDelete(id, email)
        if (deletedList) {
          res.status(201).send(new SuccessResponse(201, email, deletedList))
        } else {
          res.status(200).send(new SuccessResponse(200, email, `No such list found for user : ${email}`))
        }
      } catch (e) {
        res.status(500).send(new UserFacingError(500, e))
      }
    })
    // .post('/:id/access', async(req, res, next) =>{
    //   const {id} = req.params
    //   const email = req.email
    //   const {emails} = req.body
    //   try {
    //     emails.forEach(email => {
    //       db.allowEditAccess(id, email)
    //     })
    //   } catch (e) {
    //     res.sendStatus(500).send('Unauthorized')
    //   }
    // })

  return router
}