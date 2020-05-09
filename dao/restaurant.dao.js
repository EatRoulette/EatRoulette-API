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
        const allRestaurants = await Restaurant.find().populate('types allergens', '-_id -__v -restaurants -users');

        return allRestaurants;
    }

    /**
     * Get the restaurant if exist
     * @param id
     * @returns {Promise<undefined|*>}
     */
    static async getById(id){
        if(mongoose.Types.ObjectId.isValid(id)){
            const restaurant = await Restaurant.findOne({_id: id}).populate('types allergens', '-_id -__v -restaurants -users');
            return restaurant;
        }
        else {
            return undefined;
        };
    }

    /**
     * Push a type into a restaurant
     * @param idType
     * @param idRestaurant
     * @returns {Promise<void>}
     */
    static async pushTypeInRestaurant(idType, idRestaurant){
        if(mongoose.Types.ObjectId.isValid(idRestaurant) && mongoose.Types.ObjectId.isValid(idType)){
            const rest = await this.getById(idRestaurant);
            rest.types.push(idType);
            const ret = await rest.save();
            return ret;
        } else {
            return undefined;
        }
    }

    /**
     * Push an allergen into a restaurant
     * @param idAllergen
     * @param idRestaurant
     * @returns {Promise<void>}
     */
    static async pushAllergenInRestaurant(idAllergen, idRestaurant){
        if(mongoose.Types.ObjectId.isValid(idRestaurant) && mongoose.Types.ObjectId.isValid(idAllergen)){
            const rest = await this.getById(idRestaurant);
            rest.allergens.push(idAllergen);
            const ret = await rest.save();
            return ret;
        } else {
            return undefined;
        }
    }

    /**
     * Remove type in restaurant
     * @param idType
     * @param idRestaurant
     * @returns {Promise<undefined|any>}
     */
    static async popTypeInRestaurant(idType, idRestaurant){
        if(mongoose.Types.ObjectId.isValid(idRestaurant) && mongoose.Types.ObjectId.isValid(idType)){
            const rest = await this.getById(idRestaurant);
            rest.types.remove(idType);
            const ret = await rest.save();
            return ret;
        } else {
            return undefined;
        }
    }

    /**
     * Remove allergen in restaurant
     * @param idAllergen
     * @param idRestaurant
     * @returns {Promise<undefined|any>}
     */
    static async popAllergenInRestaurant(idAllergen, idRestaurant){
        if(mongoose.Types.ObjectId.isValid(idRestaurant) && mongoose.Types.ObjectId.isValid(idAllergen)){
            const rest = await this.getById(idRestaurant);
            rest.allergens.remove(idAllergen);
            const ret = await rest.save();
            return ret;
        } else {
            return undefined;
        }
    }

    /**
     * Update by id
     * @param id
     * @param updates
     * @returns {Promise<undefined|*>}
     */
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
