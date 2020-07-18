const bodyParser = require('body-parser');
const FriendsListUserController = require('../controllers').FriendsListUserController;
const UserController = require('../controllers').UserController;


module.exports = function(app) {

    /**
     * Menu management
     */

    app.post('/gotoRestaurant/user/:token', bodyParser.json(), HistoricalController.create_history);
  
    app.get('/frontTracking/restaurant/user/:idTokenUser', HistoricalController.render_stats_for_front);
    app.get('/tracking/restaurant/user/:idTokenUser', HistoricalController.render_stats_about_a_user);
  
    app.get('/historic/restaurant/:idTokenUser/:idRestaurant', HistoricalController.render_historic_details);

    app.post('/manage/create/friendsListUser', bodyParser.json(), FriendsListUserController.createFriendsListUser);

    app.put('/manage/friendsListUser/:friendsListUserId', bodyParser.json() , FriendsListUserController.updateFriendsListUser);

    app.delete('/manage/friendsListUser/:friendsListUserId', FriendsListUserController.deleteFriendsListUser);

    app.put('/manage/friendsListUser/products/:friendsListUserId', bodyParser.json() , FriendsListUserController.add_users);

    app.delete('/manage/friendsListUser/products/:friendsListUserId', bodyParser.json(), FriendsListUserController.deleteFriendsListUser);

    app.get('/friendsListUsers', FriendsListUserController.getAllFriendsListUsers);
    app.get('/myFriendsListUsers/:token', FriendsListUserController.getAllFriendsListUsersForUser);
    app.post('/myFriendsListUsers/add/:token', bodyParser.json(), FriendsListUserController.friendsListUsersAddUser);
    app.post('/myFriendsListUsers/new/:token', bodyParser.json(), FriendsListUserController.friendsListUsersCreate);
    app.post('/myFriendsListUsers/delete/:token', bodyParser.json(), FriendsListUserController.friendsListUsersDeleteUser);
    app.get('/friendsListUser/:friendsListUserId', FriendsListUserController.getFriendsListUserById);
    app.delete('/manage/friendsListUser/users/:friendsListUserId', bodyParser.json(), FriendsListUserController.deleteFriendsListUserForUser);


    app.get('/myRestaurantList/:token', RestaurantListController.getAllForUser);
    app.post('/myRestaurantList/new/:token', bodyParser.json(), RestaurantListController.createForUser);
    app.post('/myRestaurantList/add/:token', bodyParser.json(), RestaurantListController.addRestaurant);
    app.post('/myRestaurantList/delete/:token', bodyParser.json(), RestaurantListController.deleteRestaurant);
    app.delete('/myRestaurantList/:id', RestaurantListController.deleteList);

    app.get('/users/', async (req,res) =>{
        const result = await UserController.getAllUser();
        res.status(200).json(result)
    });
    app.get('/usersWithId/', UserController.getAllUserWithId);
    app.get('/user/:token', UserController.getUser);



    app.post('/user/update/:token', bodyParser.json(), UserController.updateUser);

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
