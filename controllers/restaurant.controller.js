const RestaurantDAO = require('../dao').RestaurantDAO;
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
     * Return a random restaurant
     * @returns {Promise<*>}
     */
    static async getRandomRestaurant(){
        const allRestaurants = await RestaurantDAO.getAll();
        if (allRestaurants.length > 0){
            const randomNumber = Tools.getRandomInt(0, allRestaurants.length -1);

            return allRestaurants[randomNumber];
        } else {
            return undefined;
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
            req.body.postalCode && req.body.dep && req.body._idSituation ) {

            const restaurant = {
                name: req.body.name, site: req.body.site, address: req.body.address,
                city: req.body.city, postalCode: req.body.postalCode, dep: req.body.dep,
                _idSituation: req.body._idSituation
            }
            return restaurant;

        } else {
            return false;
        }
    }

}

module.exports = RestaurantController;
