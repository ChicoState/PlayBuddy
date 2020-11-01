const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  title: String,
  description: String,
  creationDateTime: Date,
  lastEditDateTime: Date,
  startDateTime: Date,
  endDateTime: Date,
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
  deleted: Number,
});

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;
