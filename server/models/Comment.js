const { Schema, model } = require('mongoose');

const commentSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true,
  },
  createdAt:{
    type: Date,
    default: Date.now()
  }
});

module.exports = commentSchema;
