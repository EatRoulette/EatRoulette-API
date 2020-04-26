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

    static async getRandomRestaurant(){
        const allRestaurants = await RestaurantDAO.getAll();
        const randomNumber = Tools.getRandomInt(0, allRestaurants.length);

        return allRestaurants[randomNumber];
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
