const express = require('express');

const activity = express.Router();

/**
 * Finds posts by id
 * @param {Number} id - The id of the post, must be only digits
 */
activity.route('/:id([0-9]+)')
  .get((req, res) => {
    const statusCode = 200;
    res.status(statusCode).json({
      id: req.params.id,
      status: statusCode,
    });
  });

module.exports = activity;
