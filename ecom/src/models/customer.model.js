const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
const DOCUMENT_NAME = 'Customer'
const COLLECTION_NAME = 'customers'
var customerSchema = new mongoose.Schema({
    phone: {type: String,required: true,unique: true},
    name: {type: String,required: true},
    address: {type: String,required: true},
    referral: {type: mongoose.Schema.Types.ObjectId, ref: 'Customer'},
    point: {type: Number,default: 0,required: true},
    tag:  { type: mongoose.Schema.Types.Mixed, require: true , default:{}},
    bpm: {type: Number,default: 1},
    type: {type: String, enum:['SI','LE']},

}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

var SI = new mongoose.Schema({
    customerId: {type: mongoose.Schema.Types.ObjectId, ref: 'Customer'},
    kitchen: {type: String,enum: ['coperation', 'charity', 'restaurant']},
    baseDiscount: {type: Number,require: true,default: 3}
}, {
    collection: 'SI',
    timestamps: true
})

var LE = new mongoose.Schema({
    customerId: {type: mongoose.Schema.Types.ObjectId, ref: 'Customer'},
    freeship: {type: Boolean,require: true,default: false},
    favorite: String
}, {
    collection: 'LE',
    timestamps: true
})



//Export the model
module.exports = {
    customer: mongoose.model(DOCUMENT_NAME, customerSchema),
    SI:  mongoose.model('SI', SI),
    LE: mongoose.model('LE', LE)
};