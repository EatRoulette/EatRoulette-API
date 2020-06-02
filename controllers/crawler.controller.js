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

    static async renderDishData(req,res,next) {
        const id = req.params.DishName;
        /*Promise.resolve()
            .then(() => FriendsListUserController.friendsListUserNotExist(req,res,next,id))
            .then(() => {
                FriendsListUserModel
                    .findById(id).populate("users")
                    .select('name users _id')
                    .exec()
                    .then(doc => {
                        if(doc){
                            res.status(200).json({
                                friendsListUser: doc,
                                request: {
                                    type: 'GET',
                                    url: `http://localhost:3000/friendsListUsers`,
                                }
                            });
                        }
                    }).catch(err => {
                    res.status(400).json({
                        message: "Bad request",
                        err,
                    });
                });
            });*/
    };
}

FriendsListUserController.prototype.modelName = 'FriendsListUser';
module.exports = FriendsListUserController;



