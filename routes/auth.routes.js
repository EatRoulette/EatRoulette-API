const bodyParser = require('body-parser');
const UserController = require('../controllers').UserController;


module.exports = function(app) {

    app.post('/auth/subscribe', bodyParser.json(), UserController.subscribe);

    app.post('/auth/login', bodyParser.json(), UserController.login);

    app.delete('/auth/logout/:sessionId',  UserController.logout);

    app.put('/auth/user/:userId', bodyParser.json() , UserController.modif_user);

    app.delete('/auth/user/:userId', UserController.delete_user);

};
