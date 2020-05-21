'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const characteristicSchema = new Schema({
    name: String
});

module.exports = mongoose.model('Characteristic', characteristicSchema);
