const bodyParser = require('body-parser');
const FriendsListUserController = require('../controllers').FriendsListUserController;


module.exports = function(app) {

    /**
     * Menu management
     */

    //TODO : MiddleWare check si user is admin
    app.post('/manage/create/friendsListUser', bodyParser.json(), FriendsListUserController.create_friendsListUser);
    //TODO : MiddleWare check si user is admin
    app.put('/manage/friendsListUser/:friendsListUserId', bodyParser.json() , FriendsListUserController.modif_friendsListUser);
    //TODO : MiddleWare check si user is admin
    app.delete('/manage/friendsListUser/:friendsListUserId', FriendsListUserController.delete_friendsListUser);
    //TODO : MiddleWare check si user is admin
    app.put('/manage/friendsListUser/products/:friendsListUserId', bodyParser.json() , FriendsListUserController.add_users);
    //TODO : MiddleWare check si user is admin
    app.delete('/manage/friendsListUser/products/:friendsListUserId', bodyParser.json(), FriendsListUserController.delete_friendsListUser);

    app.get('/friendsLists', FriendsListUserController.friendsListUsers_get_all);
    app.get('/friendsList/:friendsListUserId', FriendsListUserController.get_friendsListUser_by_id);

};
