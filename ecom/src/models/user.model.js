const { Schema, model } = require("mongoose");
const { Roles } = require("../constants/role");

const DOCUMENT_NAME = "User";
const COLLECTION_NAME = "users";

const userModel = new Schema({
    
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    avatar: {type: String, default: null},
    role: {type: String, enum:Object.values(Roles),  default: Roles.USER, required: true},
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, userModel);