const mongoose = require('mongoose')
const connectString = 'mongodb://localhost:27017/ecom'

const testSchema = new mongoose.Schema({
    name: String
})

const Test = mongoose.model('test', testSchema)

describe('Mongoose Connection',()=>{
    let connection;

    beforeAll( async ()=>{
        connection = await mongoose.connect(connectString)
    })


    afterAll(async ()=>{
        await connection.disconnect()
    })

    it('should be connected to moongo',()=>{
        expect(mongoose.connection.readyState).toBe(1)
    })

    it('should save a new document to dbs',async ()=>{
        const user = new Test({name: 'nam'})
        user.save()
        expect(user.isNew).toBe(true)
    })
    it('should find a document in dbs',async ()=>{
        const user =await Test.findOne({name: 'nam'})
        expect(user).toBeDefined

    })
})

