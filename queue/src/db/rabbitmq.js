const amqp = require('amqplib')

const connectRabbitmq = async ()=>{
    try {
        const connection =await amqp.connect('amqp://localhost')
        if(!connection) throw new Error('cannot established connection!')

        const channel = await connection.createChannel()
        return {channel, connection}
    } catch (error) {
        console.error(error)
        throw error
    }

}

const test_connectRabbitmq = async ()=>{
    try {
        const {channel, connection} = await connectRabbitmq()
        const queue = 'test-queue'
        const message = 'here is test msg'

        await channel.assertQueue(queue)
        await channel.sendToQueue(queue, Buffer.from(message))


        await connection.close()
    } catch (error) {
        console.error('Error when test rabbitmq: ', error)
    }
}

const consumerQueue = async (channel, queueName) =>{
    try {
        await channel.assertQueue(queueName, {durable: true})
        console.log('waiting for message...')

        channel.consume(queueName, msg =>{
            console.log(`Recived message: ${queueName}::`, msg.content.toString())
        },{
            noAck: true
        })
    } catch (error) {
        console.error('error publish message to RabbitMQ: ',error )
        throw Error
    }
}

module.exports = {connectRabbitmq, test_connectRabbitmq, consumerQueue}
