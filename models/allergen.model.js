'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const allergenSchema = new Schema({
    name: String,
    restaurants: [{
        type: Schema.Types.ObjectId,
        ref: 'Restaurant'
    }],
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
});

module.exports = mongoose.model('Allergen', allergenSchema);
