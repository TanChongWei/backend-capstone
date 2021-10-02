const express = require('express')
const TodoList = require('../schema/todolist')
const TodoListTask = require('../schema/todoListTask')
const { v4: uuidv4 } = require('uuid')

module.exports = (db) => {
  const router = express.Router()

  router
    .get('/', async(req, res, next) => {
      const {email} = req.email
      const todoLists = await db.findListsByEmail(email)
      res.send(todoLists)
    })
    .post('/', async(req, res, next) => {
      try {
        const {email} = req.email 
        const {listName, tasks} = req.body
        const listTasks = tasks.map(task => {
          return new TodoListTask(task)
        })
        const todoListId = uuidv4()
        const newList = new TodoList(todoListId, listName, email, listTasks)
        await db.InsertTodoList(newList)
        res.send(201).send(newList)
      } catch (e) {
        console.log(e)
        return e.message
      }
    })
    .get('/:id', async(req, res, next)=>{
      const {id} = req.params
      const foundList = await db.findListById(id)
      if (foundList) {
        res.status(201).send(foundList)
      } else {
        res.status(400).send('List not found')
      }
    })
    .put('/:id', async(req, res,next) => {
      const {id} = req.params
      const {name} = req.body
      try {
        const updatedList = await db.findListByIdAndUpdate(id, name)
        res.status(200).send(updatedList)
      } catch (e) {
        res.status(400).send('List not found')
      }
    })
    .delete('/:id', async(req, res, next) => {
      const {id} = req.params
      try {
        const deletedList = await db.findListByIdAndDelete(id)
        res.status(201).send(deletedList)
      } catch (e) {
        res.status(400).send('List not found')
      }
    })
    .post('/:id/access', async(req, res, next) =>{
      const {id} = req.params
      const {emails} = req.body
      try {
        emails.forEach(email => {
          db.allowEditAccess(id, email)
        })
      } catch (e) {
        res.status(500).send('Unauthorized')
      }
    })

  return router
}