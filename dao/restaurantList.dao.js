'use strict';
const RestaurantList = require('../models').RestaurantList;
let mongoose = require('mongoose');


class RestaurantListDao {

    static async getAllRestaurantListForUserId(userId) {
        return RestaurantList.find({$and:[{"creator":{$eq:userId}}]})
            .populate('restaurants');
    }
}

module.exports = RestaurantListDao;
