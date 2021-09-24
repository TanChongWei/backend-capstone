const express = require('express')
const logger = require('morgan')
require('dotenv').config()

const app = express()

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Listening on PORT:${PORT}`)
})
