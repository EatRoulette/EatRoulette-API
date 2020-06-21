'use strict';
const RestaurantList = require('../models').RestaurantList;
let mongoose = require('mongoose');


class RestaurantListDao {

    static async getAllRestaurantListForUserId(userId) {
        return RestaurantList.find({$and:[{"creator":{$eq:userId}}]})
            .populate('restaurants');
    }

    /**
     * @param id {string}
     * @returns {Promise<FriendsListUser|undefined>}
     */
    static async findById(id) {
        if(mongoose.Types.ObjectId.isValid(id)) {
            return RestaurantList.findOne({_id: id});
        }
        return null;
    }
}

module.exports = RestaurantListDao;
