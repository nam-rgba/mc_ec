const {test_connectRabbitmq} = require('../db/rabbitmq')

describe('RabbitMQ Connection',()=>{
    it('should connect successfully to rabbitMQ',async ()=> {
        const result  = await test_connectRabbitmq()
        expect(result).toBeUndefined(); 
    })
})