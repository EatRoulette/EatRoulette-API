const bodyParser = require('body-parser');
const RestaurantController = require('../controllers').RestaurantController;

module.exports = function(app) {

    /**
     * Create restaurant
     */
    app.post('/restaurant', bodyParser.json(), async (req, res) => {
        const ret = await RestaurantController.saveRestaurant(req);

        if(ret === -1){
            res.status(400).end();
        } else if(ret){
            res.status(200).json(ret);
        }
        res.status(500).end();

    });

    /**
     * Get all restaurants
     */
    app.get('/restaurant', bodyParser.json(), async (req, res) => {
        const allRestaurants = await RestaurantController.getAllRestaurants();

        if(allRestaurants){
            res.status(200).json(allRestaurants);
        }
        res.status(500).end();
    });

    /**
     * Get random restaurant
     */
    app.get('/restaurant/rand', async (req, res) => {
        const randRest = await RestaurantController.getRandomRestaurant();

        if(randRest){
            res.status(200).json(randRest);
        }
        res.status(500).end();
    });

    /**
     * Get restaurant by id
     */
    app.get('/restaurant/:id', bodyParser.json(), async (req, res) => {
        res.status(501).end();
    });

    /**
     * Modify restaurant by id
     */
    app.put('/restaurant/:id', bodyParser.json(), async (req, res) => {
        res.status(501).end();
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


};