(async () => {
  require('dotenv').config()
  const amqplib = require('amqplib')
  const queueName = 'todoListAccess'
  const AMQP_URL = process.env.AMQP_URL || 'amqp://localhost:5672'
  
  const TodoListService = require('./services/todoList')
  const db = require('./db')
  const todoListService = TodoListService(db)

  const client = await amqplib.connect(AMQP_URL)
  const channel = await client.createChannel()
  await channel.assertQueue(queueName)
  channel.consume(queueName, (data) => {
    const {todoListId, emails} = JSON.parse(data.content)
    todoListService.grantListAccess(todoListId, emails)
      .then(() => {
        channel.ack(data)
      })
  })
})().catch((e) => console.log(e))
