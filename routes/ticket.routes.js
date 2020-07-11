const bodyParser = require('body-parser');
const TicketController = require('../controllers').TicketController;


module.exports = function(app) {

    app.post('/ticket/support/:token', bodyParser.json(), TicketController.support_request);
    app.post('/ticket/support/comment/:token', bodyParser.json(), TicketController.add_comment_to_ticket_from_front);
    app.get('/ticket/support/:token', TicketController.get_tickets_for_user);
    app.get('/ticket/support/:token/:id', TicketController.get_ticket_for_user);
    app.post('/ticket/create/', bodyParser.json(), TicketController.create_ticket);
    app.delete('/ticket/:id/comments/:comment', TicketController.delete_comment_of_ticket);
    app.post('/ticket/:id/comments/:idAuthor', bodyParser.json(), TicketController.add_comment_to_ticket);

    /**
     * Ticket desk management
     */

    app.get('/ticket/desk/open', async (req, res) => {
        const tickets = await TicketController.getOpenTickets();

        if (tickets.length > 0){
            res.status(200).json(tickets);
        } else {
            res.status(204).end()
        }

        res.status(500).end();
    });

    app.put('/ticket/desk/:id/:status', async (req, res) => {
        const ret = await TicketController.updateTicketStatus(req.params.id, req.params.status);



       if (ret === -1 ){
           res.status(400).end()
       } else {
           res.status(200).end();
       }

        res.status(500).end();
    });

};
