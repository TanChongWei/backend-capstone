const express = require('express')
const { UserFacingError } = require('../schema/error')

function authRouter(service) {
  const router = express.Router()

  router.post('/register',  async(req, res, next) => {
    try {
      const {email, password} = req.body
      const token = await service.createUser(email, password)
      if (token) {
        res.cookie('token', token).status(201).send({token})
      } else {
        res.status(400).send(new UserFacingError(400,`Email ${email} already exists! Please use another email.`))
      }
    } catch (e) {
      res.status(500).send(new UserFacingError(500, e))
    }
  })
  
  router.post('/login', async(req, res, next) => {
    try {
      const {email, password} = req.body
      const token = await service.loginUser(email, password)
      if (token) {
        res.cookie('token', token).send({token})
      } else {
        res.status(401).status(200).send(new UserFacingError(401, 'Invalid Email and/or Password combination'))
      }
    } catch (e) {
      res.status(500).send(new UserFacingError(500, e))
    }
  })

  return router
}

module.exports = authRouter