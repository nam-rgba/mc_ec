const mongoose = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Notification'
const COLLECTION_NAME = 'Notifications'


/* 
    ORDER-001: Success
    ORDER-002: Fail
    PROMOTION-001: New promotion
    PRODUCT-001: New product

*/

// Declare the Schema of the Mongo model
var notificationSchema = new mongoose.Schema({
    noti_type: {type: String, enum:['ORDER_001','ORDER_002','PROMOTION_001','PRODUCT_001'], require: true},
    noti_receiveId: {type: Number, require: true},
    noti_content: {type: String, require: true},
    noti_option: {type: Object, default:{}},
    noti_link: {type: String, require: true}

},{
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, notificationSchema);