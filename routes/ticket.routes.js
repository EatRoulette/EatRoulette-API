const bodyParser = require('body-parser');
const TicketController = require('../controllers').TicketController;


module.exports = function(app) {

    app.post('/ticket/support/:token', bodyParser.json(), TicketController.support_request);
    app.get('/ticket/support/:token', bodyParser.json(), TicketController.get_tickets_for_user);
    app.post('/ticket/create/', bodyParser.json(), TicketController.create_ticket);
    app.delete('/ticket/:id/comments/:comment', TicketController.delete_comment_of_ticket);
    app.post('/ticket/:id/comments/:idAuthor', bodyParser.json(), TicketController.add_comment_to_ticket);
};
