const {listenToQueue} = require('./src/service/consumerQueue.service')

const queueName ='test'
listenToQueue(queueName).then(()=>{
    console.log('Message consumer strated: ', queueName)
}).catch( err =>{
    console.error('Message consumer failed: ', err.message)
})