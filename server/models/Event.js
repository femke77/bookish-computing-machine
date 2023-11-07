const { Schema, model } = require("mongoose");
const inviteeSchema = require("./Invitee");
const commentSchema = require("./Comment");
const contributionSchema = require("./Contribution");
const eventSchema = new Schema({
  // also links to the event array in User
  hostID: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  location: {
    // stretch goal, add map api
    type: String,
    required: true,
  },
  potluck: {
    // if false then contribution is not needed for the event as it is a fully hosted event!
    type: Boolean,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  comments: [commentSchema],
  invitees: [inviteeSchema],
  potluckContributions: [contributionSchema],
});

const Event = model("Event", eventSchema);

module.exports = Event;
