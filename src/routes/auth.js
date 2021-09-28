const express = require('express')

function authRouter(service) {
  const router = express.Router()

  router.post('/register',  async(req, res, next) => {
    try {
      const {email, password} = req.body
      const token = await service.createUser(email, password) 
      if (token) {
        res.cookie('token', token).send({token: token})
      } else {
        res.status(400).send(`Email ${email} already exists! Please use another email.`)
      }
    } catch (e) {
      console.log(e.message)
      res.status(404).send(`${e.message}`)
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

module.exports = authRouter