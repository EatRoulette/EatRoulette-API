const bodyParser = require('body-parser');
const FriendsListUserController = require('../controllers').FriendsListUserController;
const RestaurantListController = require('../controllers').RestaurantListController;
const UserController = require('../controllers').UserController;
const HistoricalController = require('../controllers').HistoricalController;
const SessionDao = require('../dao').SessionDAO;


module.exports = function(app) {

    /**
     * Menu management
     */

    app.post('/gotoRestaurant/user', bodyParser.json(), HistoricalController.create_history);

    app.get('/tracking/restaurant/user/:idUser', HistoricalController.render_stats_about_a_user);

    app.post('/manage/create/friendsListUser', bodyParser.json(), FriendsListUserController.create_friendsListUser);

    app.put('/manage/friendsListUser/:friendsListUserId', bodyParser.json() , FriendsListUserController.modif_friendsListUser);

    app.delete('/manage/friendsListUser/:friendsListUserId', FriendsListUserController.delete_friendsListUser);

    app.put('/manage/friendsListUser/products/:friendsListUserId', bodyParser.json() , FriendsListUserController.add_users);

    app.delete('/manage/friendsListUser/products/:friendsListUserId', bodyParser.json(), FriendsListUserController.delete_friendsListUser);

    app.get('/friendsListUsers', FriendsListUserController.friendsListUsers_get_all);
    app.get('/myFriendsListUsers/:token', FriendsListUserController.friendsListUsers_get_all_for_user);
    app.post('/myFriendsListUsers/add/:token', bodyParser.json(), FriendsListUserController.friendsListUsers_add_user);
    app.post('/myFriendsListUsers/new/:token', bodyParser.json(), FriendsListUserController.friendsListUsers_create);
    app.post('/myFriendsListUsers/delete/:token', bodyParser.json(), FriendsListUserController.friendsListUsers_delete_user);
    app.get('/friendsListUser/:friendsListUserId', FriendsListUserController.get_friendsListUser_by_id);
    app.delete('/manage/friendsListUser/users/:friendsListUserId', bodyParser.json(), FriendsListUserController.delete_friendsListUser_user);


    app.get('/myRestaurantList/:token', RestaurantListController.get_all_for_user);
    app.post('/myRestaurantList/new/:token', bodyParser.json(), RestaurantListController.create_for_user);
    app.post('/myRestaurantList/add/:token', bodyParser.json(), RestaurantListController.add_restaurant);
    app.post('/myRestaurantList/delete/:token', bodyParser.json(), RestaurantListController.delete_restaurant);
    app.delete('/myRestaurantList/:id', RestaurantListController.delete_list);

    app.get('/user/:token', UserController.get_user);


    app.post('/user/update/:token', bodyParser.json(), UserController.modif_user);

    app.post('/user/search/:token', bodyParser.json(), async (req, res) => {
        // UserController.search_user
        let ret;
        const token = req.params.token;
        const userId = await SessionDao.getUserIDByToken(token);
        if(userId){
            const { firstName, lastName} = req.body
            if(firstName && !lastName){
                ret = await UserController.searchUserByFirstName(firstName)
            }else if(!firstName && lastName){
                ret = await UserController.searchUserByLastName(lastName)
            }else if(firstName && lastName){
                ret = await UserController.searchUserByFirstNameAndLastName(firstName, lastName)
            }
            const newRes = ret.filter(user => user.id.toString() !== userId.toString())
            if(newRes){
                res.status(200).json(newRes);
            }else{
                res.status(500).end();
            }
        }else{
            res.status(500).end();
        }

    });

};
