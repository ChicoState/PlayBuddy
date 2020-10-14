const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text: String,
  creationDateTime: Date,
  lastEditDateTime: Date,
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
