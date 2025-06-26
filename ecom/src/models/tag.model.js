const {Schema, model} = require("mongoose")
const DOCUMENT_NAME =  'Tag'
const COLLECTTION_NAME = 'tag'


// Declare the Schema of the Mongo model
var tagSchema = new Schema({
    name: {type: String, require: true},
},{
    collection: COLLECTTION_NAME,
    timestamps: false
});

//Export the model
module.exports = model(DOCUMENT_NAME, tagSchema);