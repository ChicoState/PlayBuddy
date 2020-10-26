const express = require('express');
const activity = require('./activity');
const user = require('./user');
const auth = require('./auth');

const api = express.Router();

api.use('/activity', activity);
api.use('/user', user);
api.use('/auth', auth);

module.exports = api;
