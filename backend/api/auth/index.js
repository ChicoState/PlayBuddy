const express = require('express');
const passport = require('passport');
const User = require('../../database/models/user');

const auth = express.Router();

/* Base code from this blog post:
 * https://mherman.org/blog/user-authentication-with-passport-dot-js/
 */

auth.post('/login', passport.authenticate('local'), (req, res) => {
  console.log('Logged in User');
  res.json({
    success: true,
  });
});

auth.post('/logout', (req, res) => {
  req.logout();
  res.json({
    success: true,
    message: 'Logged out',
  });
});

auth.post('/register', (req, res) => {
  const { username, email, password } = req.body;

  User.register(new User({ username, primaryEmail: email }), password, (error) => {
    if (error) {
      return res.json({
        success: false,
        error,
      });
    }

    // Successfully created user, send acknowledgement
    return res.json({
      success: true,
      username,
    });
  });
});

module.exports = auth;
