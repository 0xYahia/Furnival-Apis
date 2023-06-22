const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
  question_title: {
    type: String,
    required: true,
  },
  question_image: {
    type: String,
    required: true,
  },
  question_description: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Community', communitySchema);
