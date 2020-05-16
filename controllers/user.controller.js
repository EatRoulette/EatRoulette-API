const UserDao = require('../dao').UserDAO;
const SessionDao = require('../dao').SessionDAO;
const CoreController = require('./core.controller');
const SecurityUtil = require('../utils').SecurityUtil;
const SessionController = require('./session.controller');

class UserController extends CoreController{

    /**
     * Subscribe function to create User
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    static async subscribe(req, res, next){
        let data = req.body;
        data.password = SecurityUtil.hashPassword(data.password);
        const authorizedFields = ['lastName','firstName','town','address','postalCode','phone','email','password','type'];

        if( data.lastName &&
            data.firstName &&
            data.town &&
            data.address &&
            data.postalCode &&
            data.phone &&
            data.email &&
            data.password &&
            data.type ){

                Promise.resolve().then(() => {
                    return UserDao.findOne({email:data.email});
                }).then(user => {
                    if(user){
                        res.status(409).json({
                            message:"This email already exist"
                        }).end();
                        throw new Error("This email already exist");
                    }
                    return UserController.create(data, {authorizedFields});
                })
                    .then(user => UserController.render(user))
                    .then(user => res.json(user))
                    .catch(next);
        }else{
            Promise.resolve().then(() => {
                res.status(409).json({
                    message:"One or more fields are empty"
                }).end();
                throw new Error("One or more fields are empty");
            }).then(() => res.json())
        }
    };

    /**
     * Create a token for the user
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    static async login(req, res, next){
        let data = req.body;
        data.password = SecurityUtil.hashPassword(data.password);

        const user = await UserDao.findOne({
            email: data.email,
            password: data.password
        });

        if(!user) {
            res.status(401).json({
                message:"Incorrect email or password"
            }).end();
            throw new Error("Incorrect email or password");
        }

        const token = await SecurityUtil.randomToken();
        const session = await SessionController.create(user,token);

        if(session){
            res.status(200).json({
                token: session.token
            });
        } else {
            res.status(500).end();
        }
    }

    /**
     * Close the session
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    static async logout(req, res, next){

        const token = req.params.token;

        const ret = await SessionDao.deleteByToken(token);

        if(ret){
            res.status(200).json({
                message: `The user has been logout`
            })
        } else {
            res.status(404).json({
                message: `Invalid token or user is not logged`
            });
        }
    }

    static async delete_user(req,res,next){
        const id = req.params.userId;
        Promise.resolve()
            .then(() =>  UserController.userNotExist(req,res,next,id))
            .then(() => {
                // Check of product alreadyExist to be sure we avoid duplicate Name
                if(UserDao.deleteById(id)){
                    res.status(200).json({
                        message: `The user ${id} has been delete with success`
                    }).end();
                }
            })
            .catch(next);
    }

    static async modif_user(req, res, next){
        const id = req.params.userId;
        let data = req.body;
        Promise.resolve()
            .then(() =>
                UserController.userNotExist(req,res,next,id)
            )
            .then(user => {
                //TODO check if email already exist
                user.set(data);
                return user.save();
            })
            .then(user => UserController.render(user))
            .then(user => res.json(user))
            .catch(next);
    }

    static async userNotExist(req,res,next,id){
        return Promise.resolve().then(() => UserDao.findById(id))
            .then(user =>{
                if(!user){
                    res.status(409).json({
                        message: `The user ${id} doesn't exist`
                    });
                    throw new Error(`The user ${id} doesn't exist`);
                }
                return user;
            });
    }
}
UserController.prototype.modelName = 'User';
module.exports = UserController;
