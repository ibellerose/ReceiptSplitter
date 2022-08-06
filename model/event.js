const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    name: {type: String, required: true},
    date: {type: Date, default: Date.now},
    friends: [String],
    itemsList: [{
        name: String,
        price: Number
    }],
    tip: {type: Number, default: 0},
    tax: {type: Number},
    total: {type: Number},
    action: {type: String, required: true},
},{
    collection: 'events'
});

const model = mongoose.model('EventSchema', EventSchema);

module.exports = model;