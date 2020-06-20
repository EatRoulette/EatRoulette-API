const bodyParser = require('body-parser');
const FriendsListUserController = require('../controllers').FriendsListUserController;
const UserController = require('../controllers').UserController;


module.exports = function(app) {

    /**
     * Menu management
     */

    app.post('/manage/create/friendsListUser', bodyParser.json(), FriendsListUserController.create_friendsListUser);

    app.put('/manage/friendsListUser/:friendsListUserId', bodyParser.json() , FriendsListUserController.modif_friendsListUser);

    app.delete('/manage/friendsListUser/:friendsListUserId', FriendsListUserController.delete_friendsListUser);

    app.put('/manage/friendsListUser/products/:friendsListUserId', bodyParser.json() , FriendsListUserController.add_users);

    app.delete('/manage/friendsListUser/products/:friendsListUserId', bodyParser.json(), FriendsListUserController.delete_friendsListUser);

    app.get('/friendsListUsers', FriendsListUserController.friendsListUsers_get_all);
    app.get('/myFriendsListUsers/:token', FriendsListUserController.friendsListUsers_get_all_for_user);
    app.get('/friendsListUser/:friendsListUserId', FriendsListUserController.get_friendsListUser_by_id);
    app.delete('/manage/friendsListUser/users/:friendsListUserId', bodyParser.json(), FriendsListUserController.delete_friendsListUser_user);

    app.get('/user/:token', UserController.get_user);

};
