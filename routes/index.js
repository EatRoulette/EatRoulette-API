const authRoutes = require('./auth.routes');
const restaurantRoutes = require('./restaurant.routes');

module.exports = function (app) {
    authRoutes(app);
    restaurantRoutes(app);
}
