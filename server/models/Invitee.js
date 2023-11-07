const { Schema, model } = require('mongoose');

const inviteeSchema = new Schema({

  name: {
    type: String,
    required: true
  },
  rsvpConfirmation: {
    type: String,
    enum: ['yes', 'no', 'maybe'],
    default: "no"
  },
  // notified: { A boolean to check if a user has been notified or not, stretch goal
  //     type: Boolean,
  //     default: false
  // }

  // need time for comment? maybe add notification?
});

module.exports = inviteeSchema;
