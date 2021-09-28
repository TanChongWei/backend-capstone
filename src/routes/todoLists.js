const express = require('express')

module.exports = (db) => {
  const router = express.Router()

  router
    .get('/', async(req, res, next) => {
      console.log(req.cookies.token)
      res.send('todo lists')
    })
    // .post('/', async(req, res, next) => {
    
  // })
  // .get('/:id', async(req, res, next)=>{

  // })
  // .put('/:id', async(req, res,next) =>{

  // })
  // .delete('/:id', async(req, res, next) => {

  // })
  // .post('/access', async(req, res, next) =>{

  // })

  return router
}