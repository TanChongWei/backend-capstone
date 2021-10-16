const express = require('express')
const { UserFacingError } = require('../schema/error')
const { SuccessResponse } = require('../schema/response')

module.exports = (service) => {
  const router = express.Router()

  router.post('/register',  async(req, res, next) => {
    try {
      const {email, password} = req.body
      const token = await service.createUser(email, password)
      return token 
        ? res.cookie('token', token).status(201).send(new SuccessResponse(201, email, {token}))
        : res.status(400)
          .send(new UserFacingError(400,`Email ${email} already exists! Please use another email.`))
      
    } catch (e) {
      res.status(500).send(new UserFacingError(500, e))
    }
  })
  
  router.post('/login', async(req, res, next) => {
    try {
      const {email, password} = req.body
      const token = await service.loginUser(email, password)
      return token 
        ? res.cookie('token', token).status(201).send(new SuccessResponse(201, email, {token}))
        : res.status(401)
          .send(new UserFacingError(401, 'Invalid Email and/or Password combination'))      
    } catch (e) {
      res.status(500).send(new UserFacingError(500, e))
    }
  })

  return router
}