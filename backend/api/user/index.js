const express = require('express');
const User = require('../../database/models/user');

const users = express.Router();

/**
 * Finds a user by id
 * If the user requested is the requesting user, send all data
 * @param {Hex} id - The user's id
 */
users.get('/:id([a-f0-9]+)', async (req, res) => {
  let foundUser;

  try {
    foundUser = await User.findById(req.params.id).exec();
  } catch (error) {
    return res.status(500).json({ error });
  }

  if (!foundUser) {
    return res.status(404).json({
      error: `Could not find user with id ${req.params.id}`,
    });
  }

  // Make a shortened user model if the requestor
  // is not the requested user or not authenticated
  let modFoundUser = {
    // eslint-disable-next-line no-underscore-dangle
    _id: foundUser._id,
    username: foundUser.username,
    fullname: foundUser.fullname,
  };

  // The requestor is the requested user
  if (req.user && (req.user.id.toString() === req.params.id)) {
    // Set to the full user object
    modFoundUser = foundUser;
  }

  return res.status(200).json({
    user: modFoundUser,
  });
});

/**
 * Finds a user by username
 * If the user requested is the requesting user, send all data
 * @param {String} username - The username of the user, only letters and numbers
 */
users.get('/:username([a-zA-Z0-9]+)', async (req, res) => {
  let foundUser;

  try {
    foundUser = await User.findOne({ username: req.params.username }).exec();
  } catch (error) {
    return res.status(500).json({ error });
  }

  if (!foundUser) {
    return res.status(404).json({
      error: `Could not find user with id ${req.params.id}`,
    });
  }

  // Make a shortened user model if the requestor
  // is not the requested user or not authenticated
  let modFoundUser = {
    // eslint-disable-next-line no-underscore-dangle
    _id: foundUser._id,
    username: foundUser.username,
    fullname: foundUser.fullname,
  };

  // The requestor is the requested user
  if (req.user && (req.user.id.toString() === req.params.id)) {
    // Set to the full user object
    modFoundUser = foundUser;
  }

  return res.status(200).json({
    user: modFoundUser,
  });
});

/**
 * Edits a user if the requestor is the requested user
 * @param {Hex} id - The id of the user
 * @body {String} username
 * @body {String} password
 * @body {Object} fullname - The first and last names to update
 *  @body {String} fullname.firstName
 *  @body {String} fullname.lastName
 * @body {String} primaryEmail
 */
users.post('/edit/:id([a-f0-9]+)', async (req, res) => {
  // Not authenticated
  if (!req.user) {
    return res.status(401).json({
      error: 'Not authenticated',
    });
  }

  let foundUser;
  try {
    foundUser = await User.findById(req.params.id).exec();
  } catch (error) {
    return res.status(500).json({ error });
  }

  if (!foundUser) {
    return res.status(404).json({
      error: `Unable to find user with id ${req.params.id}`,
    });
  }

  // Make sure the requestor is the requested user
  // eslint-disable-next-line no-underscore-dangle
  if (foundUser._id.toString() !== req.user.id) {
    return res.status(403).json({
      error: 'Not authorized',
    });
  }

  // Make the changes
  foundUser.username = req.body.username || foundUser.username;
  foundUser.fullname = req.body.fullname || foundUser.fullname;
  foundUser.password = req.body.password || foundUser.password;
  foundUser.primaryEmail = req.body.primaryEmail || foundUser.primaryEmail;

  // Try to save
  try {
    await foundUser.save();
  } catch (error) {
    return res.status(500).json({ error });
  }

  // Send the modified user back
  return res.status(200).json({ user: foundUser });
});

module.exports = users;
