const express = require('express');
const activity = require('./activity');
const user = require('./user');

const api = express.Router();

api.use('/activity', activity);
api.use('/user', user);

module.exports = api;
