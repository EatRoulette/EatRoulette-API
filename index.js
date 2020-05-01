'use strict';
require('dotenv').config();
const express = require('express');
const routes = require('./routes');
var cors = require('cors');
const initDbConnection = require('./dao/connection-manager');
const app = express();
//enables cors
app.use(cors());
initDbConnection();
routes(app);
app.listen(process.env.API_PORT, () => console.log(`EatRoulette-API Started on port ${process.env.API_PORT}...`));
