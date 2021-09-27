const express = require('express')

module.exports = (service) => {
  const router = express.Router()

  router.post('/register',  async(req, res, next) => {
    const {email, password} = req.body
    const token = await service.createUser(email, password) 
    if (token) {
      res.send({token: token})
    } else {
      res.status(400).send(`Email ${email} already exists! Please use another email.`)
    }
  })
  
  router.post('/login', async(req, res, next) => {
    const {email, password} = req.body
    const token = await service.loginUser(email, password)
    if (token) {
      res.send({token: token})
    } else {
      res.status(400).send('Email and/or password are incorrect.')
    }
  })

  return router
}