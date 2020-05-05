const bodyParser = require('body-parser');
const TicketController = require('../controllers').TicketController;


module.exports = function(app) {

    app.post('/create/ticket', bodyParser.json() , TicketController.create_ticket);
    app.delete('/ticket/:id/comments/:comment', TicketController.delete_comment_of_ticket);
    app.post('/:id/comments/:idAuthor',bodyParser.json(), TicketController.add_comment_to_ticket);
};
