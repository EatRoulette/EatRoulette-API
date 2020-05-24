const TicketModel = require('../models').Ticket;
const CoreController = require('./core.controller');
const SessionDao = require('../dao').SessionDAO;
const TicketDao = require('../dao').TicketDAO;
const TicketBean = require('../beans').TicketBean;
const CommentBean = require('../beans').CommentBean;

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
     * create a support request ticket
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    static async support_request(req, res, next){
        const data = req.body;
        const token = req.params.token;
        const userId = await SessionDao.getUserIDByToken(token);
        if(userId && data){
            const newTicket = {
                message : data.description,
                title: data.object,
                status:'created',
                author: userId,
                type: data.type
            }
            await TicketController.create(newTicket)
            res.status(200).json({
                message: `The ticket has been created`
            })
        }else{
            res.status(500).json({
                message: `An error occurred`
            })
        }
    }

    static manageTicket(ticket){
        let status = "";
        let type = "";
        switch (ticket.status){ // 'created' | 'pending' | 'done' | 'standby'
            case 'created' :
                status = "Créé";
                break;
            case 'pending' :
                status = "En cours de traitement";
                break;
            case 'done' :
                status = "Traité";
                break;
            case 'standby' :
                status = "En attente";
                break;
        }
        switch (ticket.type){ // 'bug' | 'request'
            case 'bug' :
                type = "Bogue";
                break;
            case 'request' :
                type = "Demande";
                break;
            // aura t on d'autre types dans le futur?
        }
        const comments = []
        ticket.comments.forEach(comment => {
            comments.push(new CommentBean(comment.message, comment.author === userId))
        })
        return new TicketBean(ticket.id, ticket.title,ticket.message, status, type, comments, ticket.created_at);
    }

    /**
     * get tickets for user
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    static async get_tickets_for_user(req, res, next){
        const token = req.params.token;
        const userId = await SessionDao.getUserIDByToken(token);
        if(userId){
            const tickets = await TicketDao.getByUserId(userId)
            const ticketBeans = [];
            tickets.forEach(ticket => {
                ticketBeans.push(TicketController.manageTicket(ticket))
            })
            res.status(200).json(ticketBeans)
        }else{
            res.status(500).json({
                message: `Une erreur est survenue`
            })
        }
    }

    /**
     * get ticket for user
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    static async get_ticket_for_user(req, res, next){
        const token = req.params.token;
        const idTicket = req.params.id;
        const userId = await SessionDao.getUserIDByToken(token);
        if(userId){
            const ticket = await TicketDao.getById(idTicket)
            if(JSON.stringify(ticket.author) === JSON.stringify(userId)){ // or else will return false (?)
                const ticketBean = TicketController.manageTicket(ticket)
                console.log(JSON.stringify(ticketBean))
                res.status(200).json(ticketBean)
            }else{
                console.log("bad author")
                res.status(500).json({
                    message: `Le ticket n'appartient pas à l'utilisateur`
                })
            }
        }else{
            res.status(500).json({
                message: `Une erreur est survenue`
            })
        }
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
