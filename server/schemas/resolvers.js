const { Event, User } = require("../models");
const { signToken, AuthenticationError } = require("../utils/auth");

const resolvers = {
  Query: {
    getEventData: async (_, { eventId }) => {
      return await Event.findOne({ _id: eventId }).populate("hostID");
    },

    getUserEvents: async (_, { userId }, context) => {
      if (context.user) {
        return await User.findOne({ _id: userId })
          .populate("hostedEvents")
          .populate("guestEvents");
      }

      throw AuthenticationError;
    },
    me: async (_, __, context) => {
      if (context.user) {
        return await User.findOne({ _id: context.user._id })
          .select("-hostID")
          .populate("hostedEvents")
          .populate("guestEvents");
      }
      throw AuthenticationError;
    },
    events: async () => {
      return await Event.find({}).populate("hostID").select("-hostedEvents");
    },
  },

  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw AuthenticationError;
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw AuthenticationError;
      }

      const token = signToken(user);

      return { token, user };
    },
    addEvent: async (parent, { eventData }, context) => {
      if (context.user) {
        const event = await Event.create(eventData);

        await User.findByIdAndUpdate(context.user._id, {
          $push: { hosted: event._id },
        });

        return event.populate("hostID");
      }

      throw AuthenticationError;
    },
    deleteEvent: async (parent, { eventId }, context) => {
      if (context.user) {
        const event = await Event.findOneAndDelete({ _id: eventId });
        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { hostedEvents: eventId } },
          { new: true }
        );
        return event;
      }

      throw AuthenticationError;
    },
    addInvitee: async (_, { eventId, name }, context) => {
      if (context.user) {
        const event = Event.findOneAndUpdate(
          { _id: eventId },
          { $push: { invitees: { name } } },
          { new: true }
        );
        // add to the Guest user's events array
        const user = await User.findOneAndUpdate(
          { name },
          { $push: { guestEvents: eventId } },
          { new: true }
        );
        if (!user) {
          throw new Error("Not a known user");
        }

        return event;
      }
      throw AuthenticationError;
    },
    deleteInvitee: async (_, { eventId, name }, context) => {
      if (context.user) {
        const event = Event.findOneAndUpdate(
          { _id: eventId },
          { $pull: { invitees: { name } } },
          { new: true }
        );
        // remove from the Guest user's events array
        await User.findOneAndUpdate(
          { name },
          { $pull: { guestEvents: eventId } },
          { new: true }
        );
        return event;
      }
      throw AuthenticationError;
    },
    // for changing the status of an invitee's rsvpConfirmation
    updateInvitee: async (_, { eventId, name, rsvpConfirmation }, context) => {
      if (context.user) {
        const event = await Event.findOne({ _id: eventId });
        const invitee = event.invitees.find((i) => i.name === name);
        invitee.rsvpConfirmation = rsvpConfirmation;
        await event.save();
        console.log(rsvpConfirmation);
        return event;
      }
      throw AuthenticationError;
    },
    addContribution: async (_, args, context) => {
      if (context.user) {
        const event = Event.findOneAndUpdate(
          { _id: args.eventId },
          { $push: { potluckContributions: args } },
          { new: true }
        );
        return event;
      }
      throw AuthenticationError;
    },

    updateEvent: async (_, { eventId, eventUpdate }, context) => {
      if (context.user) {
        return await Event.findOneAndUpdate(
          { _id: eventId },
          { $set: eventUpdate },
          { runValidators: true, new: true }
        );
      }
      throw AuthenticationError;
    },
    deleteContribution: async (_, { eventId, contributionId }, context) => {
      if (context.user) {
        return await Event.findOneAndUpdate(
          { _id: eventId },
          { $pull: { potluckContributions: { _id: contributionId } } },
          { new: true }
        );
      }
      throw AuthenticationError;
    },
    addComment: async (_, args, context) => {
      if (context.user) {
        console.log(args);
        return await Event.findOneAndUpdate(
          { _id: args.eventId },
          { $push: { comments: args } },
          { runValidators: true, new: true }
        );
      }
      throw AuthenticationError;
    },
    deleteComment: async (_, { eventId, commentId }, context) => {
      if (context.user) {
        return await Event.findOneAndUpdate(
          { _id: eventId },
          { $pull: { comments: { _id: commentId } } }
        );
      }
      throw AuthenticationError;
    },
  },
  User: {
    __resolveType(user) {
      return user.role;
    },
  },
};

module.exports = resolvers;
