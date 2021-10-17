module.exports = () => {
  const service = {}
  require('dotenv').config()
  const amqplib = require('amqplib')
  const queueName = 'todoListAccess'
  const AMQP_URL = process.env.AMQP_URL || 'amqp://localhost:5672'

  service.listAccessProducer = async (data) => {
    const client = await amqplib.connect(AMQP_URL)
    const channel = await client.createChannel()
    await channel.assertQueue(queueName)
	
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)), {
      contentType: 'application/json',
    })
  }
  return service
}




