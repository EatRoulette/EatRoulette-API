const bodyParser = require('body-parser');
const RestaurantController = require('../controllers').RestaurantController;
const TypeRestaurantController = require('../controllers').TypeRestaurantController;
const AllergenController = require('../controllers').AllergenController;

module.exports = function(app) {

    /**
     * Create restaurant
     */
    app.post('/restaurant', bodyParser.json(), async (req, res) => {
        const ret = await RestaurantController.saveRestaurant(req);

        if(ret === -1){
            res.status(400).end();
        } else if(ret){
            res.status(201).json(ret);
        }
        res.status(500).end();

    });

    /**
     * Get all restaurants
     */
    app.get('/restaurant', bodyParser.json(), async (req, res) => {
        const allRestaurants = await RestaurantController.getAllRestaurants();

        if(allRestaurants){
            if(allRestaurants.length > 0) {
                res.status(200).json(allRestaurants);
            } else {
                res.status(204).end();
            }
        }
        res.status(500).end();
    });

    /**
     * Get random restaurant
     */
    app.get('/restaurant/rand', bodyParser.json(), async (req, res) => {
        const randRest = await RestaurantController.getRandomRestaurant(req.body);

        if(randRest){
            if(randRest === -1){
                res.status(204).end();
            } else if (randRest){
                res.status(200).json(randRest);
            }
        }
        res.status(500).end();
    });

    /**
     * Get restaurant by id
     */
    app.get('/restaurant/:id', bodyParser.json(), async (req, res) => {
        const ret = await RestaurantController.getRestaurantsById(req.params.id);

        if(ret){
            if(ret === -1){
                res.status(404).end();
            } else if (ret) {
                res.status(200).json(ret);
            }
        }
        res.status(500).end();
    });

    /**
     * Modify restaurant by id
     */
    app.put('/restaurant/:id', bodyParser.json(), async (req, res) => {
        const ret = await RestaurantController.modifyById(req.params.id, req);

        if(ret === -1) {
            res.status(400).end()
        } else if (ret === -2){
            res.status(404).end()
        } else if(ret){
            res.status(200).json(ret);
        }
        res.status(500).end();
    });

    /**
     * Delete restaurant by id
     */
    app.delete('/restaurant/:id', async (req, res) => {
        const ret = await RestaurantController.deleteById(req.params.id);

        if(ret === -1) {
            res.status(404).json({
                message: "This restaurant does not exist"
            });
        } else if(ret){
            res.status(200).end();
        }
        res.status(500).end();
    });

    /**
     * Search restaurant
     */
    app.post('/restaurant/search', bodyParser.json(), async (req, res) => {
        const { name, postalCode, city} = req.body
        let ret = "";

        if(name && !postalCode && !city){
            ret = await RestaurantController.searchRestaurantsByName(name);
        }
        else if(!name && postalCode && !city){
            ret = await RestaurantController.searchRestaurantsByPostalCode(postalCode);
        }
        else if(!name && !postalCode && city){
            ret = await RestaurantController.searchRestaurantsByCity(city);
        }
        else if(!name && postalCode && city){
            ret = await RestaurantController.searchRestaurantsByCityAndPostalCode(city, postalCode);
        }
        else if(name && postalCode && !city){
            ret = await RestaurantController.searchRestaurantsByNameAndPostalCode(name, postalCode);
        }
        else if(name && !postalCode && city){
            ret = await RestaurantController.searchRestaurantsByNameAndCity(name, city);
        }
        else if(name && postalCode && city){
            ret = await RestaurantController.searchRestaurantsByNameAndCityAndPostalCode(name, city, postalCode);
        }

        if(ret){
            res.status(200).json(ret);
        }else{
            res.status(500).end();
        }
    });

    /**
     * Allergen and characteristic management
     */

    /**
     * Add an allergen to restaurant
     */
    app.post('/allergen/restaurant/:idRestaurant', bodyParser.json(), async (req, res) => {
        const ret = await RestaurantController.addAllergenToRestaurant(req.params.idRestaurant, req.body.idAllergen);

        if(ret === -1){
            res.status(400).end();
        }else{
            res.status(200).json(ret);
        }
        res.status(500).end();
    });

    /**
     * Delete an allergen of a restaurant
     */
    app.delete('/allergen/restaurant/:idRestaurant', bodyParser.json(), async (req, res) => {
        const ret = await RestaurantController.delAllergenToRestaurant(req.body.idAllergen, req.params.idRestaurant);

        if(ret === -1){
            res.status(400).end();
        }else{
            res.status(200).json(ret);
        }
        res.status(500).end();
    });

    /**
     * Characteristic management
     */

    /**
     * Add a characteristic to a restaurant
     */
    app.post('/characteristic/restaurant/:idRestaurant', bodyParser.json(), async (req, res) => {
        const ret = await RestaurantController.addCharacteristicToRestaurant(req.params.idRestaurant, req.body.idCharac);

        if(ret === -1){
            res.status(400).end();
        }else{
            res.status(200).json(ret);
        }
        res.status(500).end();
    });

    /**
     * Delete a restaurant characteristic
     */
    app.delete('/characteristic/restaurant/:idRestaurant', bodyParser.json(), async (req, res) => {
        const ret = await RestaurantController.delCharacteristicToRestaurant(req.body.idCharac, req.params.idRestaurant);

        if(ret === -1){
            res.status(400).end();
        }else{
            res.status(200).json(ret);
        }
        res.status(500).end();
    });


    /**
     * Type restaurants management
     */

    /**
     * Create restaurant type
     */
    app.post('/type/restaurant', bodyParser.json(), async (req, res) => {
        const ret = await TypeRestaurantController.saveType(req);

        if(ret === -2){
            res.status(409).end();
        }else if(ret === -1){
            res.status(400).end();
        } else if(ret){
            res.status(201).json(ret);
        }
        res.status(500).end();

    });

    /**
     * Add a type to a restaurant
     */
    app.post('/type/restaurant/:idRestaurant', bodyParser.json(), async (req, res) => {
        const ret = await RestaurantController.addTypeToRestaurant(req.params.idRestaurant, req.body.idType);

        if(ret === -1){
            res.status(400).end();
        }else{
            res.status(200).json(ret);
        }
        res.status(500).end();
    });

    /**
     * Get all restaurant types
     */
    app.get('/type/restaurant', async (req, res) => {
        const allTypes = await TypeRestaurantController.getTypes();

        if(allTypes){
            if(allTypes.length > 0) {
                res.status(200).json(allTypes);
            } else {
                res.status(204).end();
            }
        }
        res.status(500).end();
    });

    /**
     * Get restaurant type by id
     */
    app.get('/type/restaurant/:id', async (req, res) => {
        const ret = await TypeRestaurantController.getTypeById(req.params.id);

        if(ret){
            if(ret === -1){
                res.status(404).end();
            } else if (ret) {
                res.status(200).json(ret);
            }
        }
        res.status(500).end();
    });

    /**
     * Update restaurant type
     */
    app.put('/type/restaurant/:id', bodyParser.json(), async (req, res) => {
        const ret = await TypeRestaurantController.modifyById(req.params.id, req);

        if(ret === -3 ){
            res.status(409).end();
        }else if(ret === -1) {
            res.status(400).end();
        } else if (ret === -2){
            res.status(404).end();
        } else if(ret){
            res.status(200).json(ret);
        }
        res.status(500).end();
    });

    /**
     * Delete a type in a restaurant
     */
    app.delete('/type/restaurant/del/:idRestaurant', bodyParser.json(), async (req, res) => {
        const ret = await RestaurantController.delTypeToRestaurant(req.params.idRestaurant, req.body.idType);

        if(ret === -1){
            res.status(400).end();
        }else if(ret){
            res.status(200).json(ret);
        }
        res.status(500).end();
    });

    /**
     * Delete restaurant type by id
     */
    app.delete('/type/restaurant/:id', async (req, res) => {
        const ret = await TypeRestaurantController.deleteById(req.params.id);

        if(ret === -1) {
            res.status(404).json({
                message: "This type does not exist"
            });
        } else if(ret){
            res.status(200).end();
        }
        res.status(500).end();
    });

};
