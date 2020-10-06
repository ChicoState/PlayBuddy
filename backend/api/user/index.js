const express = require('express');

const users = express.Router();

/**
 * Finds a user by id
 * @param {Number} id - The user's id
 */
users.get('/:id([0-9]+)', (req, res) => {
  const statusCode = 200;
  res.status(statusCode).json({
    status: statusCode,
    user: {
      id: req.params.id,
    },
  });
});

/**
 * Finds a user by username
 * @param {String} username - The username of the user, only letters and numbers
 */
users.get('/:username([a-zA-Z0-9]+)', (req, res) => {
  const statusCode = 200;
  res.status(statusCode).json({
    status: statusCode,
    user: {
      username: req.params.username,
    },
  });
});

module.exports = users;
