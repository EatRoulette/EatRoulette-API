const restaurantRoutes = require('./restaurant.routes');

module.exports = function (app) {
    restaurantRoutes(app);
}
