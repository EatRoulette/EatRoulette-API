'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const allergenSchema = new Schema({
    name: String
});

module.exports = mongoose.model('Allergen', allergenSchema);
