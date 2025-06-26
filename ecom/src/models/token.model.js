const {Schema, model} = require('mongoose'); // Erase if already required

DOCUMENT_NAME='key'
COLLECTION_NAME='keys'

// Declare the Schema of the Mongo model
var tokenSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        reference: 'Shop'
    },
    accessKey:{
        type: String,               // Mỗi tài khoản (client) sẽ có một public key riêng
        required: true,
    },
    refreshKey:{
        type: String,               // Mỗi tài khoản (client) sẽ có một public key riêng
        required: true,
    },
    refreshTokensUsed: {             // Refresh token có thời hạn 7 ngày, khi đăng nhập trên nhiều thiết bị
        type: Array,            // thì có thể lưu nhiều fresh token
        default: [],            // Đăng xuất trên một thiết bị sẽ xóa fresh token của thiết bị đó
    },
    refreshToken:{
        type: String,
        require: true,
    }
},{
    collection: COLLECTION_NAME,
    timestamps: true
});

//Export the model
module.exports = model(DOCUMENT_NAME, tokenSchema);