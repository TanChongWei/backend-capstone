const amqplib = require('amqplib')
const queueName = 'todoListAccess'
const service = require('./services/todoList')

;(async () => {
  const client = await amqplib.connect('amqp://localhost:5672')
  const channel = await client.createChannel()
  await channel.assertQueue(queueName)
  channel.consume(queueName, (data) => {
    const {todoListId, emails} = JSON.parse(data.content)
    service.grantListAccess(todoListId, emails)
      .then(() => {
        channel.ack(data)
      })
  })
})().catch((e) => console.log(e))
