const TicketModel = require('../models').Ticket;
const CoreController = require('./core.controller');
const UserController = require("./user.controller");
const RestaurantController = require('./restaurant.controller');
const HistoryModel = require('../models').Historical;
const SessionDao = require('../dao').SessionDAO;
const UserDao = require('../dao').UserDAO;
const TicketDao = require('../dao').TicketDAO;
const TicketBean = require('../beans').TicketBean;
const CommentBean = require('../beans').CommentBean;

class HistoricalController extends CoreController {
    /**
     *
     * @param list
     * @param options
     * @returns {Promise<*>}
     */
    static render(list, options = {}) {
        const populates = [
            {
                path: 'users',
                select: 'name username email',
            },
            {
                path: 'restaurants',
            },
        ];

        return super.render(list, { ...options, populates })
    }

    /**
     * create a ticket with status todo
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    static create_history(req, res, next){
        let data = req.body;
        const authorizedFields = [
            'users',
            'restaurants'
        ];
        Promise.resolve()
            .then(() => {
                const promiseAll = [];
                if(!Array.isArray(data.users) && !data.users.length){
                    res.status(406).json({
                        status: 406,
                        message:"You need a put a string Id in users field body"
                    }).end();
                    throw new Error("You need a put a string Id in users field bod");
                }

                data.users.forEach((elem, i)=>{
                    promiseAll.push(UserController.userNotExist(req,res,next,elem));
                });

                return Promise.all(promiseAll);
            })
            .then( ()  => HistoricalController.create(data, { authorizedFields }))
            .then( order => HistoricalController.render(order))
            .then( order => res.status(201).json(order))
            .catch(next);
    }

    /**
     * create a ticket with status todo
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    static async render_stats_about_a_user(req, res, next){
        let idUser = req.params.idUser;




        await UserController.userNotExist(req,res,next,idUser);
        let allStats = await HistoricalController.createStats(idUser);



        await res.status(201).json({allStats});
    }

    static async createStats(idUser){
        let userStats = {};
        let friendsStats = [];
        let restaurantsStats = [];
        let allstats = {};
        const result = await HistoryModel.find({
            users:{
                $in:[idUser]
            }
        });
        userStats.typesGoStats = [];
        userStats.characteristicsGoStats = [];
        userStats.numberPurchase = result.length;
        for (const element of result){
            // Check how many item a user meet an other user
            for (let i = 0; i < element.users.length; i++){
                if(HistoricalController.contains(friendsStats,"friend",''+element.users[i])) {
                    friendsStats.find(function (item, j) {
                        if(item.friend == ''+element.users[i]){
                            friendsStats[j].count++;
                        }
                    });
                } else {
                    friendsStats.push({
                        "friend": element.users[i],
                        "count": 1,
                    })
                }
            }
            //Check what type of restaurant user likes to go
            let restaurantInfo = await RestaurantController.getRestaurantsById(element.restaurants);
            if(HistoricalController.contains(restaurantsStats,"restaurant_id",''+restaurantInfo._id)) {
                restaurantsStats.find(function (item, j) {
                    if(item.restaurant_id == ''+restaurantInfo._id){
                        restaurantsStats[j].count++;
                    }
                });
            } else {

                restaurantsStats.push({
                    "restaurant_id": restaurantInfo._id,
                    "count": 1,
                })
            }

            for (let i = 0; i < restaurantInfo.types.length; i++){
                if(HistoricalController.contains(userStats.typesGoStats,"type",''+restaurantInfo.types[i].name)){
                    userStats.typesGoStats[i].count++;
                } else {
                    userStats.typesGoStats.push({
                        "type": ''+restaurantInfo.types[i].name,
                        "count": 1
                    });
                }
            }
            for (let i = 0; i < restaurantInfo.characteristics.length; i++){
                if(HistoricalController.contains(userStats.characteristicsGoStats,"characteristic",''+restaurantInfo.characteristics[i].name)){
                    userStats.characteristicsGoStats[i].count++;
                } else {
                    userStats.characteristicsGoStats.push({
                        "characteristic": ''+restaurantInfo.characteristics[i].name,
                        "count": 1
                    });
                }
            }


        }


        friendsStats.forEach(element => {
            if(userStats.numberPurchase !== 0){
                element.rateMeetPercent = element.count/userStats.numberPurchase*100;
            }
        });
        userStats.typesGoStats.forEach(element => {
            if(userStats.numberPurchase !== 0){
                element.rateTypePercent = element.count/userStats.numberPurchase*100;
            }
        });

        allstats = {
            friendsStats,
            restaurantsStats,
            userStats,
        };

        return allstats;
    }

    static contains(arr, key, val) {
        for (let i = 0; i < arr.length; i++) {
            if(arr[i][key] == val) return true;
        }
        return false;
    }

}

HistoricalController.prototype.modelName = 'historical';

module.exports = HistoricalController;
