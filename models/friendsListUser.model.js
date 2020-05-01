'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const friendsListUserSchema = new Schema({
    name: String,
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
});

module.exports = mongoose.model('FriendsListUser', friendsListUserSchema);
