const TicketModel = require('../models').Ticket;
let CoreController = require('./core.controller');

class TicketController extends CoreController {
    /**
     * 
     * @param list
     * @param options
     * @returns {Promise<*>}
     */
    static render(list, options = {}) {
        const populates = [
            {
                path: 'author',
                select: 'name username',
            },
            {
                path: 'users',
                select: 'name username',
            },
            {
                path: 'comments.author',
                select: 'name username',
            },
        ];

        return super.render(list, { ...options, populates })
    }

    /**
     * create a ticket with status todo
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    static async create_ticket(req, res, next){
        let data = req.body;
        data.status = 'todo';

        const authorizedFields = [
            'title',
            'author',
            'message',
            'emergency',
            'status',
            'users'
        ];
        Promise.resolve()
            .then(() => TicketController.create(data, { authorizedFields }))
            .then(ticket => TicketController.render(ticket))
            .then(ticket => res.status(200).json(ticket))
            .catch(next);
    }

    /**
     * delete comment of ticket from id ticket and comment id
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    static async delete_comment_of_ticket(req, res, next) {
    const id = req.params.id;
    const commentId = req.params.comment;

    Promise.resolve()
        .then(() => TicketModel.findById(id).exec())
        .then(ticket => {
            ticket.comments.id(commentId).remove();
            return ticket.save()
        })
        .then(ticket => TicketController.render(ticket))
            .then(ticket => res.json(ticket))
            .catch(next);
    }

    /**
     * Add comment to ticket by post request
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    static async add_comment_to_ticket(req, res, next){
    const id = req.params.id;
    const author = req.params.idAuthor;
    const { message } = req.body;

    Promise.resolve()
        .then(() => TicketModel.findById(id))
        .then(ticket => {
            ticket.comments.push({ author, message });
            return ticket.save();
        })
        .then(ticket => TicketController.render(ticket))
        .then(ticket => res.json(ticket))
        .catch(next);
    }

    static async get_ticket_from_id(req, res, next){
        const id = req.params.id;

        const fields = [
            '_id',
            'author',
            'title',
            'message',
            'emergency',
            'status',
            'tags',
            'users',
            'comments',
            'created_at'
        ];

        Promise.resolve()
            .then(() => TicketController.read(id, { fields }))
            .then(ticket => res.json({ ticket }))
            .catch(next);
    }

    static update(id, data, options) {
        if (data.users) {
            const list = new Set(data.users);
            data.users = [...list];
        }
        return super.update(id, data, options)
    }







}

TicketController.prototype.modelName = 'Ticket';

module.exports = TicketController;
