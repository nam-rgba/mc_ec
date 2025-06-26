//!dmbg

const mongoose = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Shop';
const COLLECTION_NAME = 'shops';
// Declare the Schema of the Mongo model
var shopSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        index:true,
    },
    email:{
        type:String,
        trim:true,
        unique:true,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    verified:{
        type:mongoose.Schema.Types.Boolean,
        default:false,
    },
    active:{
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    },
    role:{
        type: Array,
        default: [],
    },
},{
    timestamps: true,
    collection: COLLECTION_NAME,
}   );

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, shopSchema);