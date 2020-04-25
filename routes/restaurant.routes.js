const bodyParser = require('body-parser');

module.exports = function(app) {

    /**
     * Create restaurant
     */
    app.post('/restaurant', bodyParser.json(), async (req, res) => {
        res.status(501).end();
    });

    /**
     * Get all restaurants
     */
    app.get('/restaurant', bodyParser.json(), async (req, res) => {
        res.status(501).end();
    });

    /**
     * Get restaurant by id
     */
    app.get('/restaurant/:id', bodyParser.json(), async (req, res) => {
        res.status(501).end();
    });

    /**
     * Get random restaurant
     */
    app.get('/restaurant/rand', bodyParser.json(), async (req, res) => {
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
    app.delete('/restaurant/id', async (req, res) => {
        res.status(501).end();
    });


};
