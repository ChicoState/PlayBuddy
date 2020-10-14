const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  fullname: {
    firstName: String,
    lastName: String,
  },
  primaryEmail: String,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
