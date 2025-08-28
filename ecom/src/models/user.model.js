const { Schema } = require("mongoose");

const DOCUMENT_NAME = "User";
const COLLECTION_NAME = "users";

const userModel = new Schema({
    _id: { type: String, default: () => new mongoose.Types.ObjectId() },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    avatar: {type: String, default: null},
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = mongoose.model(DOCUMENT_NAME, userModel);