const CoreController = require('./core.controller');
const SessionDao = require('../dao').SessionDAO;
const RestaurantListDao = require('../dao').RestaurantListDao;
const RestaurantBean = require('../beans').RestaurantBean;
const RestaurantListBean = require('../beans').RestaurantListBean;
const RestaurantListModel = require('../models').RestaurantList;

class RestaurantListController extends CoreController {

    static async get_all_for_user(req, res, next) {
        const token = req.params.token;
        const userId = await SessionDao.getUserIDByToken(token);
        if(userId){
            const lists = await RestaurantListDao.getAllRestaurantListForUserId(userId)
            res.status(200).json(RestaurantListController.manageRestaurantList(lists))
        }else{
            res.status(500).json({
                message: `Une erreur est survenue`
            })
        }
    };

    static async create_for_user(req,res,next){
        const {name} = req.body; // name
        const token = req.params.token;
        const userId = await SessionDao.getUserIDByToken(token); // creator
        const newList = {
            name: name,
            creator: userId,
            restaurants: []
        }
        const result = await RestaurantListController.create(newList)
        if(result){
            res.status(200).json({})
        }else {
            res.status(500).json({
                message: `Impossible d'enregistrer la nouvelle liste`
            })
        }
    }

    static async add_restaurant(req,res,next){
        const {idRestaurant} = req.body;
        const restaurants = await RestaurantListController.getRestaurants(req)
        restaurants.push(idRestaurant)
        await RestaurantListController.update(req, res, restaurants)
    }


    static async delete_restaurant(req,res,next){
        const {idRestaurant} = req.body;
        const restaurants = await RestaurantListController.getRestaurants(req)
        restaurants.remove(idRestaurant)
        await  RestaurantListController.update(req, res, restaurants)
    }

    static async delete_list(req,res,next){
        const ret = await RestaurantListController.deleteById(req.params.id);

        if(ret === -1) {
            res.status(400).json({
                message: "Une erreur est survenue lors de la suppression"
            });
        } else if(ret){
            res.status(200).end();
        }
        res.status(500).end();
    }

    static async update(req, res, restaurants){
        const token = req.params.token;
        const {idList} = req.body;
        const userId = await SessionDao.getUserIDByToken(token);

        await RestaurantListModel.updateOne({"_id":idList},{restaurants:RestaurantListController.eliminateDuplicates(restaurants)})

        const lists = await RestaurantListDao.getAllRestaurantListForUserId(userId)
        res.status(200).json(RestaurantListController.manageRestaurantList(lists))
    }

    static async getRestaurants(req){
        const {idList} = req.body;
        const list = await RestaurantListDao.findById(idList);
        return list.restaurants;
    }

    static manageRestaurantList(lists){
        const result = [];
        for(let list of lists){
            const restaurants = []
            for(let restaurant of list.restaurants){
                restaurants.push(new RestaurantBean(restaurant._id, restaurant.name, restaurant.types, restaurant.address, restaurant.city))
            }
            result.push( new RestaurantListBean(restaurants, list._id, list.name))
        }
        return result;

    }

    /**
     * Delete restaurant if exist
     * @param id
     * @returns {Promise<number|*>}
     */
    static async deleteById(id){
        const restaurant = await RestaurantListDao.findById(id);

        if(restaurant) {
            return await RestaurantListDao.deleteById(id);
        } else {
            return -1;
        }
    }

}

RestaurantListController.prototype.modelName = 'RestaurantList';
module.exports = RestaurantListController;



