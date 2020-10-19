const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  title: String,
  description: String,
  creationDateTime: Date,
  lastEditDateTime: Date,
  location: {
    latitude: Number,
    longitude: Number,
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
  }],
});

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;
