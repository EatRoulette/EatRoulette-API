'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const allergenSchema = new Schema({
    name: String,
    // TODO duplicate with allergens into user
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
