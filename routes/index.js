const authRoutes = require('./auth.routes');
const restaurantRoutes = require('./restaurant.routes');
const userRoutes = require('./user.routes');

module.exports = function (app) {
    authRoutes(app);
    restaurantRoutes(app);
    userRoutes(app);
};
