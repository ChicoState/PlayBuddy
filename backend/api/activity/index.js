const express = require('express');

const activity = express.Router();

/**
 * Returns activity data by id
 * @param {Number} id - The id of the activity, must be only digits
 */
activity.route('/:id([0-9]+)')
  .get((req, res) => {
    const statusCode = 200;
	const shortened = Boolean(req.query.shortened);
    res.status(statusCode).json({
      id: req.params.id,
      status: statusCode,
	  shortened,
    });
  });

/**
 * Edits activity by id
 * @param {Number} id - The id of the activity, must be only digits
 */
activity.route('/edit/:id([0-9]+)')
  .post((req, res) => {
    const statusCode = 200;
    res.status(statusCode).json({
      id: req.params.id,
      status: statusCode,
    });
  });

/**
 * Creates a new activity and returns its id
 * @param {Number} id - The id of the activity, must be only digits
 */
activity.route('/create')
  .post((req, res) => {
    const statusCode = 200;
	//res.redirect('/activity/edit/#');
    res.status(statusCode).json({
      id: 666,
      status: statusCode,
    });
  });

module.exports = activity;
