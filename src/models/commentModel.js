const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  comment: String,
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
});
