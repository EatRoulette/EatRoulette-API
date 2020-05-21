const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    message: { type: String, default: '' },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    created_at: { type: Date, default: Date.now },
});

const TicketSchema = new Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, default: '' },
    message: { type: String, default: '' },
    status: {
        type: String,
        default: 'created',
        enum: ['created', 'pending', 'done', 'standby'],
    },
    emergency: { type: Number, default: 0 }, // relevant for Java back office
    users: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        default: [],
    }, // user in charge of the ticket =>  relevant for Java back office
    comments: { type: [CommentSchema], default: [] },
    created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Ticket', TicketSchema);
