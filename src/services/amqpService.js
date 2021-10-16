module.exports = () => {
  const service = {}
  const amqplib = require('amqplib')
  const queueName = 'todoListAccess'

  service.listAccessProducer = async (data) => {
    const client = await amqplib.connect('amqp://localhost:5672')
    const channel = await client.createChannel()
    await channel.assertQueue(queueName)
	
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)), {
      contentType: 'application/json',
    })
  }
  return service
}




