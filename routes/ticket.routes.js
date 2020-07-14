const bodyParser = require('body-parser');
const TicketController = require('../controllers').TicketController;


module.exports = function(app) {

    app.post('/ticket/support/:token', bodyParser.json(), TicketController.supportRequest);
    app.post('/ticket/support/comment/:token', bodyParser.json(), TicketController.addCommentToTicketFromFront);
    app.get('/ticket/support/:token', TicketController.getTicketsForUser);
    app.get('/ticket/support/:token/:id', TicketController.getTicketForUser);
    app.post('/ticket/create/', bodyParser.json(), TicketController.createTicket);
    app.delete('/ticket/:id/comments/:comment', TicketController.deleteCommentOfTicket);
    app.post('/ticket/:id/comments/:idAuthor', bodyParser.json(), TicketController.addCommentToTicket);

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
