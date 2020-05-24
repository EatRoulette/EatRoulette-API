const Ticket = require('../models').Ticket;
const mongoose = require('mongoose');

class TicketDao {

    /**
     * Get all tickets for one user
     * @returns {Promise<*>}
     */
    static async getByUserId(userId) {
        return await Ticket.find({$and:[{"author":{$eq:userId}}]})
            .populate({
                path: 'ticket',
                model: 'Ticket',
                select: 'id title message status type comments',
                populate: {
                    path: 'comments',
                    model: 'Comment',
                    select: 'message author'
                }
            });
    }

}

module.exports = TicketDao;
