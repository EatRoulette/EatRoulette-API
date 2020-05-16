'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: String,
    firstname: String,
    address: String,
    phone: String,
    town: String,
    email: String,
    postalCode: String,
    password: String,
    type: String,
    sessions: [{
        type: Schema.Types.ObjectId,
        ref: 'Session'
    }]
});

module.exports = mongoose.model('User', userSchema);
