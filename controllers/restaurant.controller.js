const RestaurantDAO = require('../dao').RestaurantDAO;
const TypeRestaurantDAO = require('../dao').TypeRestaurantDAO;
const AllergenDAO = require('../dao').AllergenDAO;
const Tools = require('../utils').Util;

class RestaurantController {

    /**
     * Save the restaurant
     * @param req
     * @returns {Promise<void>}
     */
    static async saveRestaurant(req){
        let restaurant = await this.buildRestaurant(req);

        if(restaurant){
            restaurant = await RestaurantDAO.saveRestaurant(restaurant);
            restaurant = await this.getRestaurantsById(restaurant._id);
            return restaurant;
        } else {
            return -1; //Bad request
        }
    }

    /**
     * Get all restaurants
     * @returns {Promise<undefined|*>}
     */
    static async getAllRestaurants(){
        const allRestaurants = await RestaurantDAO.getAll();

        if(allRestaurants){
            return allRestaurants;
        }
        return undefined;
    }

    /**
     * Get restaurant by id
     * @param id
     * @returns {Promise<undefined>}
     */
    static async getRestaurantsById(id){
        const restaurant = await RestaurantDAO.getById(id);

        if(restaurant){
            return restaurant;
        } else {
            return -1;
        }
        return undefined;
    }

    /**
     * Return a random restaurant
     * @returns {Promise<*>}
     */
    static async getRandomRestaurant(){
        const allRestaurants = await RestaurantDAO.getAll();

        if(allRestaurants){
            if (allRestaurants.length > 0){
                const randomNumber = Tools.getRandomInt(0, allRestaurants.length -1);
                return allRestaurants[randomNumber];
            } else {
                return -1;
            }
        }
        return undefined;
    }

    /**
     * Add a type to a restaurant
     * @param idRestaurant
     * @param idType
     * @returns {Promise<void|undefined>}
     */
    static async addTypeToRestaurant(idRestaurant, idType){
        if(!idRestaurant, !idType){
            return -1; //Bad request
        }
        const isAddToType = TypeRestaurantDAO.pushRestaurantInType(idType, idRestaurant);
        const isAddToRest = RestaurantDAO.pushTypeInRestaurant(idType, idRestaurant);

        if (await isAddToType && await isAddToRest){
            return await this.getRestaurantsById(idRestaurant);
        }
        return undefined;
    }

    /**
     * Add an allergen to a restaurant
     * @param idRestaurant
     * @param idAllergen
     * @returns {Promise<void|undefined>}
     */
    static async addAllergenToRestaurant(idRestaurant, idAllergen){
        if(!idRestaurant, !idAllergen){
            return -1; //Bad request
        }
        const isAddToAllerg = AllergenDAO.pushRestaurantInAllergen(idAllergen, idRestaurant);
        const isAddToRest = RestaurantDAO.pushAllergenInRestaurant(idAllergen, idRestaurant);

        if (await isAddToAllerg && await isAddToRest){
            return await this.getRestaurantsById(idRestaurant);
        }
        return undefined;
    }

    /**
     * Delete a type of a restaurant
     * @param idRestaurant
     * @param idType
     * @returns {Promise<undefined|number>}
     */
    static async delTypeToRestaurant(idRestaurant, idType){
        if(!idRestaurant, !idType){
            return -1; //Bad request
        }
        const isAddToType = await TypeRestaurantDAO.popRestaurantInType(idType, idRestaurant);
        const isAddToRest = await RestaurantDAO.popTypeInRestaurant(idType, idRestaurant);

        if (isAddToType && isAddToRest){
            return await this.getRestaurantsById(idRestaurant);
        }
        return undefined;
    }

    /**
     * Delete a allergen of a restaurant
     * @param idAllergen
     * @param idRestaurant
     * @returns {Promise<undefined|number>}
     */
    static async delAllergenToRestaurant(idAllergen, idRestaurant){
        if(!idAllergen, !idRestaurant){
            return -1; //Bad request
        }
        const isAddToType = await AllergenDAO.popRestaurantInAllergen(idAllergen, idRestaurant);
        const isAddToRest = await RestaurantDAO.popAllergenInRestaurant(idAllergen, idRestaurant);

        if (isAddToType && isAddToRest){
            return await this.getRestaurantsById(idAllergen);
        }
        return undefined;
    }

    /**
     * Update the model by id
     * @param id
     * @param req
     * @returns {Promise<*|{site: *, address, city, postalCode, name: *, _idSituation, dep}|boolean|number>}
     */
    static async modifyById(id, req){
        let modifiedRestaurant = await this.buildRestaurant(req);

        if(modifiedRestaurant){
            modifiedRestaurant = await RestaurantDAO.modifyById(id, modifiedRestaurant);
            if(modifiedRestaurant){
                return modifiedRestaurant;
            } else {
                return -2;  //Not found
            }
        } else {
            return -1; //Bad request
        }

    }

    /**
     * Delete restaurant if exist
     * @param id
     * @returns {Promise<number|*>}
     */
    static async deleteById(id){
        const restaurant = await RestaurantDAO.getById(id);

        if(restaurant) {
            const isDeleted = await RestaurantDAO.deleteById(id);
            return isDeleted
        } else {
            return -1; //404 not found
        }
    }


    /**
     * Check and build the restaurant
     * @param req
     * @returns {Promise<{site: *, address, city, postalCode, name: *, _idSituation, dep}|boolean>}
     */
    static async buildRestaurant(req){

        if (req.body.name && req.body.site && req.body.address && req.body.city &&
            req.body.postalCode && req.body.dep && req.body.types && req.body._idSituation ) {

            const restaurant = {
                name: req.body.name, site: req.body.site, address: req.body.address,
                city: req.body.city, postalCode: req.body.postalCode, dep: req.body.dep, types: req.body.types,
                _idSituation: req.body._idSituation
            }
            return restaurant;

        } else {
            return false;
        }
    }

}

module.exports = RestaurantController;
