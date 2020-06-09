const RestaurantDAO = require('../dao').RestaurantDAO;
const TypeRestaurantDAO = require('../dao').TypeRestaurantDAO;
const AllergenDAO = require('../dao').AllergenDAO;
const AllergenController = require('./alleregen.controller');
const CharacteristicController = require('./characteristic.controller');
const CharacteristicDAO = require('../dao').CharacteristicDAO;
const RestaurantBean = require('../beans').RestaurantBean;
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
     * add the restaurant
     * @param req
     * @returns {Promise<void>}
     */
    static async addRestaurant(req){
        const restaurant = await this.buildRestaurantFromBean(req);
        if(restaurant){
            return await RestaurantDAO.saveRestaurant(restaurant);
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
    }

    /**
     * search restaurant
     * @param name
     */
    static async searchRestaurantsByName(name){
        const restaurants = await RestaurantDAO.searchByName(name);

        return RestaurantController.manageRestaurants(restaurants);
    }
    /**
     * search restaurant
     * @param city
     */
    static async searchRestaurantsByCity(city){
        const restaurants = await RestaurantDAO.searchByCity(city);
        return RestaurantController.manageRestaurants(restaurants)
    }
    /**
     * search restaurant
     * @param postalCode
     */
    static async searchRestaurantsByPostalCode(postalCode){
        const restaurants = await RestaurantDAO.searchByPostalCode(postalCode);
        return RestaurantController.manageRestaurants(restaurants)
    }
    /**
     * search restaurant
     * @param city
     * @param postalCode
     */
    static async searchRestaurantsByCityAndPostalCode(city, postalCode){
        const restaurants = await RestaurantDAO.searchByCityAndPostalCode(city, postalCode);
        return RestaurantController.manageRestaurants(restaurants)
    }
    /**
     * search restaurant
     * @param name
     * @param postalCode
     */
    static async searchRestaurantsByNameAndPostalCode(name, postalCode){
        const restaurants = await RestaurantDAO.searchByNameAndPostalCode(name, postalCode);
        return RestaurantController.manageRestaurants(restaurants)
    }
    /**
     * search restaurant
     * @param name
     * @param city
     */
    static async searchRestaurantsByNameAndCity(name, city){
        const restaurants = await RestaurantDAO.searchByNameAndCity(name, city);
        return RestaurantController.manageRestaurants(restaurants)
    }
    /**
     * search restaurant
     * @param name
     * @param city
     * @param postalCode
     */
    static async searchRestaurantsByNameAndCityAndPostalCode(name, city, postalCode){
        const restaurants = await RestaurantDAO.searchByNameAndCityAndPostalCode(name, city, postalCode);
        return RestaurantController.manageRestaurants(restaurants)
    }

    static manageRestaurant(restaurant){
        return new RestaurantBean(restaurant._id, restaurant.name, restaurant.types, restaurant.address);
    }

    static manageRestaurants(restaurants){
        const result = []
        restaurants.forEach(r => {
            if(r.status !== 'pending'){
                result.push(this.manageRestaurant(r))
            }
        })
        return result;
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
     * Add an allergen to a restaurant
     * @param idRestaurant
     * @param idCharac
     * @returns {Promise<void|undefined>}
     */
    static async addCharacteristicToRestaurant(idRestaurant, idCharac){
        if(!idRestaurant, !idCharac){
            return -1; //Bad request
        }
        const isAddToCharac = CharacteristicDAO.pushRestaurantInCharac(idCharac, idRestaurant);
        const isAddToRest = RestaurantDAO.pushCharacInRestaurant(idCharac, idRestaurant);

        if (await isAddToCharac && await isAddToRest){
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
            return await this.getRestaurantsById(idRestaurant);
        }
        return undefined;
    }

    /**
     * Delete characteristic to a restaurant
     * @param idCharac
     * @param idRestaurant
     * @returns {Promise<undefined|number>}
     */
    static async delCharacteristicToRestaurant(idCharac, idRestaurant){
        if(!idCharac, !idRestaurant){
            return -1; //Bad request
        }
        const isAddToType = await CharacteristicDAO.popRestaurantInCharac(idCharac, idRestaurant);
        const isAddToRest = await RestaurantDAO.popCharacInRestaurant(idCharac, idRestaurant);

        if (isAddToType && isAddToRest){
            return await this.getRestaurantsById(idRestaurant);
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

    static async getCharacteristics(req ){
        const characteristics = []
        for(const characteristic of req.body.characteristics){
            const newCharacteristic = await RestaurantController.getCharacteristic(characteristic)
            if(newCharacteristic !== -1){
                characteristics.push(newCharacteristic)
            }
        }
        return characteristics;
    }

    static async getCharacteristic(characteristic){
        return await CharacteristicController.getCharacteristicById(characteristic.id)
    }

    static async getAllergen(allergen){
        return await AllergenController.getAllergenById(allergen.id)
    }

    static async getAllergens(req ){
        const allergens = []
        for(const allergen of req.body.allergens){
            const newAllergen = await RestaurantController.getAllergen(allergen)
            if(newAllergen !== -1){
                allergens.push(newAllergen)
            }
        }
        return allergens;
    }

    static async buildRestaurantFromBean(req){
        let characteristics = []
        let allergens = []

        if (req.body.name && req.body.address && req.body.city &&
            req.body.postalCode ) {
            if(req.body.allergens){
                allergens = await RestaurantController.getAllergens(req)
            }
            if(req.body.characteristics){
                characteristics = await RestaurantController.getCharacteristics(req)
            }
            return {
                name: req.body.name,
                website: req.body.website,
                address: req.body.address,
                city: req.body.city,
                postalCode: req.body.postalCode,
                dep: req.body.dep,
                characteristics: characteristics,
                allergens: allergens,
                status: 'pending',
                // TODO types: for now, table does not exists so front doesn't send it (because he has no type to make the user choose)
            }

        } else {
            return false;
        }
    }

}

module.exports = RestaurantController;
