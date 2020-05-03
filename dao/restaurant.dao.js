const Restaurant = require('../models').Restaurant;
const mongoose = require('mongoose');

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

    /**
     * Get the restaurant if exist
     * @param id
     * @returns {Promise<undefined|*>}
     */
    static async getById(id){
        if(mongoose.Types.ObjectId.isValid(id)){
            const restaurant = await Restaurant.findOne({_id: id});
            return restaurant;
        }
        else {
            return undefined;
        };
    }

    static async modifyById(id, updates){
        if(mongoose.Types.ObjectId.isValid(id)){
            return Restaurant.findOneAndUpdate({_id: id}, updates,{
                new: true //To return model after update
            });
        } else {
            return undefined;
        }
    }

    /**
     * Delete by id
     * @param id
     * @returns {Promise<boolean>}
     */
    static async deleteById(id){
        let ret = false;

        await Restaurant.deleteOne({_id: id}, (err) => {
            if (err) ret =  false;
            ret = true;
        })
        return ret;
    }


}

module.exports = RestaurantDao;
