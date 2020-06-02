let FriendsListUserModel = require('../models').FriendsListUser;
let FriendsListUserDao = require('../dao').FriendsListUserDao;
let CoreController = require('./core.controller');
let UserController = require('./user.controller');
let mongoose = require('mongoose');

class FriendsListUserController extends CoreController {

    static render(list,options = {}){
        const populates = [
            {path:'users'},
            {path:'creator'}
        ];
        return super.render(list, { ...options,populates});
    }

    static crawlerRender
}

FriendsListUserController.prototype.modelName = 'FriendsListUser';
module.exports = FriendsListUserController;



