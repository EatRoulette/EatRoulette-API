'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const restaurantSchema = new Schema({
    name: String,
    site: String,
    address: String,
    city: String,
    postalCode: String,
    dep: String,
    _idSituation: {
        type: Schema.Types.ObjectId,
        ref: 'Situation'
    }
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
