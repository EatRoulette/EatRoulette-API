const authRoutes = require('./auth.routes');
const restaurantRoutes = require('./restaurant.routes');
const userRoutes = require('./user.routes');
const ticketRoutes = require('./ticket.routes');

module.exports = function (app) {
    authRoutes(app);
    restaurantRoutes(app);
    userRoutes(app);
    ticketRoutes(app);
};
