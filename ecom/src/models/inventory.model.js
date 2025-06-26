const {model, Schema, Types} = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Inventory'
const COLLECTION_NAME = 'Inventory' 

// Declare the Schema of the Mongo model
var inventorySchema = new Schema({
    iv_productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        require: true
    },
    iv_location:{
        type: String,
        default: 'here'
    },
    iv_stock: {
        type: Number,
        require: true
    },
    iv_shopId:{
        type: Schema.Types.ObjectId,
        ref: 'Shop'
    },
    iv_reversation:{
        type: Array,
        default:[]
    }

},{
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = model(DOCUMENT_NAME, inventorySchema);