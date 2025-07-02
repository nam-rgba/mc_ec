const {consumerQueue, connectRabbitmq} = require('../db/rabbitmq')

const messageService  = {
    listenToQueue : async (queueName) =>{
        try {
            const {channel, connnection } = await connectRabbitmq ()
            await consumerQueue(channel, queueName)
        } catch (error) {
            console.error('Error in consumer queue: ', error)
            throw Error
        }
    }
}

module.exports = messageService