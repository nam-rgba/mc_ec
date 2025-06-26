const {Schema, model} = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
const DOCUMENT_NAME = 'apiKey'
const COLLECTION_NAME = 'apiKeys'
var apiKeySchema = new Schema({
    key:{
        type:String,
        required:true,
        unique:true,
    },
    status:{
        type:Boolean,
        default:true,
    },
    permission:{
        type: [String],
        required:true,
        enum: ['0000','1111','2222']
    }
},{
    timestamps:true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = model(DOCUMENT_NAME, apiKeySchema);