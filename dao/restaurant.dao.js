const Restaurant = require('../models').Restaurant;

class RestaurantDao {

    /**
     * Save a restaurant
     * @param restaurant
     * @returns {Promise<*>}
     */
    static async saveRestaurant(restaurant){
        const restaurant1 = new Restaurant(restaurant)
        const ret = await restaurant1.save();

        return ret;
    }

    /**
     * Get all restaurants
     * @returns {Promise<*>}
     */
    static async getAll(){
        const allRestaurants = await Restaurant.find();

        return allRestaurants;
    }




}

module.exports = RestaurantDao;
