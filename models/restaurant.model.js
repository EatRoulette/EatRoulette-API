'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const restaurantSchema = new Schema({
    name: String,
    website: String,
    address: String,
    city: String,
    postalCode: String,
    dep: String,
    types: [{
        type: Schema.Types.ObjectId,
        ref: 'TypeRestaurant'
    }],
    allergens: [{
        type: Schema.Types.ObjectId,
        ref: 'Allergen'
    }],
    characteristics: [{
        type: Schema.Types.ObjectId,
        ref: 'Characteristic'
    }]
    // TODO status
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
