const cookieParser = require('cookie-parser')
const express = require('express')
const logger = require('morgan')

module.exports = (router) => {
  const app = express()
  app.use(logger('common'))
  app.use(express.json())
  app.use(cookieParser())
  app.use(router)
  return app
}