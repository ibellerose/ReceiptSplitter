const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    friendList: [String],
    splitReceiptList: [Object],
},{
    collection: 'users'
});

const model = mongoose.model('UserSchema', UserSchema);

module.exports = model;