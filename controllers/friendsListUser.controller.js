let FriendsListUserModel = require('../models').FriendsListUser;
let FriendsListUserDao = require('../dao').FriendsListUserDao;
let CoreController = require('./core.controller');
let UserController = require('./user.controller');
let mongoose = require('mongoose');

class FriendsListUserController extends CoreController {

    static render(list,options = {}){
        const populates = [
            {path:'users'}
        ];
        return super.render(list, { ...options,populates});
    }

    static async create_friendsListUser(req, res, next) {
        let data = req.body;
        const authorizedFields = ['name','users'];
        Promise.resolve().then(() => {
            return FriendsListUserDao.findOne({name:req.body.name});
        })
            .then(friendsListUser => {
                if(friendsListUser){
                    res.status(409).json({
                        status: 409,
                        message:"This friendsListUser already exist"
                    }).end();
                    throw new Error("This friendsListUser already exist");
                }

                if(!Array.isArray(data.users)){
                    res.status(406).json({
                        status: 406,
                        message:"You need to add users Array in your body"
                    }).end();
                    throw new Error("You need to add users Array in your body");
                }


                const promiseAll = [];

                data.users.forEach((elem, i)=>{
                    promiseAll.push(UserController.userNotExist(req,res,next,elem._id));
                });

                return Promise.all(promiseAll);
            })
            .then(() => FriendsListUserController.create(data, {authorizedFields}))
            .then(friendsListUser => FriendsListUserController.render(friendsListUser))
            .then(friendsListUser => res.json(friendsListUser))
            .catch(next);
    };

    static async friendsListUsers_get_all(req, res, next) {
        FriendsListUserModel
            .find().populate("users")
            .select("name users _id")
            .exec()
            .then(docs => {
                const response = {
                    count: docs.length,
                    friendsListUsers: docs.map(doc => {
                        return {
                            name: doc.name,
                            users: doc.users,
                            _id: doc._id,
                            request: {
                                type: 'GET',
                                url: `http://localhost:3000/friendsListUser/${doc._id}`
                            }
                        };
                    })
                };
                res.status(200).json(response);

            }).catch(err =>{
            res.status(400).json({
                message: "Bad request",
                err,
            });
        });
    };

    static async get_friendsListUser_by_id(req,res,next) {
        const id = req.params.friendsListUserId;
        FriendsListUserController.friendsListUserNotExist(req,res,next,id);
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
    };

    static async modif_friendsListUser(req, res, next){
        const id = req.params.friendsListUserId;
        let data = req.body;
        Promise.resolve().then(() =>{
            const promiseAll = [];
            // Check of friendsListUser alreadyExist to be sure we avoid duplicate Name
            if(data.name) promiseAll.push(FriendsListUserController.friendsListUserNameNotSameIdAlreadyExist(req,res,next,id));
            if(data.users) data.users.forEach((elem, i)=>{
                promiseAll.push(UserController.userNotExist(req,res,next,elem._id));
            });

            return Promise.all(promiseAll);
        })
            .then(() =>  FriendsListUserController.friendsListUserNotExist(req,res,next,id))
            .then(friendsListUser => {
                friendsListUser.set(data);
                return friendsListUser.save();
            })
            .then(friendsListUser => FriendsListUserController.render(friendsListUser))
            .then(friendsListUser => res.json({
                friendsListUser,
                request: {
                    type: 'GET',
                    url: `http://localhost:3000/friendsListUser/${id}`
                }
            }))
            .catch(next);
    }

    static async delete_friendsListUser(req,res,next){
        const id = req.params.friendsListUserId;
        Promise.resolve()
            .then(() =>  FriendsListUserController.friendsListUserNotExist(req,res,next,id))
            .then(() => {
                // Check of friendsListUser alreadyExist to be sure we avoid duplicate Name
                if(FriendsListUserDao.deleteById(id)){
                    res.status(200).json({
                        message: `The friendsListUser ${id} has been delete with success`
                    }).end();
                }
            })
            .catch(next);
    }

    static async delete_friendsListUser_user(req,res,next) {
        const id = req.params.friendsListUserId;
        let data = req.body;
        let friendsListUser = null;
        const promiseAll = [];
        Promise.resolve().then(() => {

            data.users.forEach((elem, i) => {
                promiseAll.push(UserController.userNotExist(req,res,next,elem._id));
            });
            promiseAll.push( FriendsListUserController.friendsListUserNotExist(req,res,next,id));

            return Promise.all(promiseAll);
        })
            .then(() => {
                // taking users id in order to check them
                return FriendsListUserModel.find({_id: id}).then(doc => {
                    let users = doc[0].users;
                    // remove id one by one
                    data.users.forEach(elem => {
                        let index = users.indexOf(elem._id);
                        if(index !== -1){
                            users.splice(index,1);
                        }
                    });
                    // cast into ObjectId
                    let usersFinal = [];
                    users.forEach(elem =>{
                        usersFinal.push(mongoose.Types.ObjectId(elem));
                    });
                    // push du new array objectId of user
                    return FriendsListUserModel.updateOne({'_id': id},{'$set':{"users":usersFinal}});
                });
            })
            .then(() => FriendsListUserController.render(FriendsListUserDao.findById(id)))
            .then(friendsListUser => res.json({
                friendsListUser,
                request: {
                    type: 'GET',
                    url: `http://localhost:3000/friendsListUser/${id}`
                }
            }))
            .catch(next);
    }

    static async add_users(req,res,next){
        const id = req.params.friendsListUserId;
        let data = req.body;
        Promise.resolve().then(() =>{
            const promiseAll = [];
            data.users.forEach((elem, i)=>{
                promiseAll.push(UserController.userNotExist(req,res,next,elem._id));
            });
            promiseAll.push(FriendsListUserController.friendsListUserNotExist(req,res,next,id));

            return Promise.all(promiseAll);
        })
            .then(() => {
                console.log(data.users);
                return FriendsListUserModel.updateOne({"_id":id},{$push:{users:{$each:data.users}}})
            })
            .then(() => FriendsListUserController.render(FriendsListUserDao.findById(id)))
            .then(friendsListUser => res.json({
                friendsListUser,
                request: {
                    type: 'GET',
                    url: `http://localhost:3000/friendsListUser/${id}`
                }
            }))
            .catch(next);
    }

    static async friendsListUserNotExist(req,res,next,id){
        return Promise.resolve()
            .then(() => FriendsListUserDao.findById(id))
            .then(friendsListUser =>{
                if(!friendsListUser){
                    res.status(404).json({
                        message: `This friendsListUser ${id} doesn't exist`
                    }).end();
                    throw new Error(`This friendsListUser ${id} doesn't exist`);
                }
                return friendsListUser;
            });
    }

    static async friendsListUserNameNotSameIdAlreadyExist(req,res,next,id) {
        Promise.resolve().then(() => FriendsListUserDao
            .find( {$and:[{"_id":{$ne:id}},{"name": {$eq:req.body.name}}]}
            ))
            .then(friendsListUser => {
                if (Array.isArray(friendsListUser) && friendsListUser.length) {
                    res.status(409).json({
                        message: "This friendsListUser already exist"
                    }).end();
                    throw new Error("This friendsListUser already exist");
                }
            }).catch(next)
    }
}

FriendsListUserController.prototype.modelName = 'FriendsListUser';
module.exports = FriendsListUserController;



