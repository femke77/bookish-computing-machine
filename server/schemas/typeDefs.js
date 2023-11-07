const gql = String.raw;

const typeDefs = gql`
  type Event {
    _id: ID
    hostID: User
    title: String!
    description: String!
    date: String!
    time: String!
    location: String!
    comments: [Comment]
    invitees: [Invitee]
    potluck: Boolean!
    createdAt: String
    potluckContributions: [Contribution]
  }

  interface User {
    _id: ID
    name: String
    email: String
  }

  type Host implements User {
    _id: ID
    name: String
    email: String
    hostedEvents: [Event]
  }

  type Guest implements User {
    _id: ID
    name: String
    email: String
    guestEvents: [Event]
  }

  type Comment {
    _id: ID
    name: String!
    content: String!
    createdAt: String
  }

  type Invitee {
    name: String!
    rsvpConfirmation: RSVP
  }

  enum RSVP {
    yes
    no
    maybe
  }

  enum Role {
    Host
    Guest
  }

  type Query {
    events: [Event]
    me: User
    # provide event id
    getEventData(eventId: ID!): Event
    # provide user id
    getUserEvents(userId: ID!): User
  }

  type Contribution {
    _id: ID!
    name: String!
    item: String!
  }

  input EventInput {
    hostID: ID!
    title: String!
    description: String!
    date: String!
    time: String!
    location: String!
    potluck: Boolean!
  }

  input EventUpdate {
    hostID: ID
    title: String
    description: String
    date: String
    time: String
    location: String
    potluck: Boolean
  }

  type Auth {
    token: ID
    user: User
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(name: String!, email: String!, password: String!, role: Role!): Auth
    addEvent(eventData: EventInput!): Event
    deleteEvent(eventId: ID!): Event
    updateEvent(eventId: ID!, eventUpdate: EventUpdate!): Event
    addInvitee(eventId: ID!, name: String!): Event
    deleteInvitee(eventId: ID!, name: String!): Event
    updateInvitee(eventId: ID!, name: String!, rsvpConfirmation: String!): Event
    addContribution(eventId: ID!, name: String!, item: String!): Event
    deleteContribution(eventId: ID!, contributionId: ID!): Event
    addComment(eventId: ID!, name: String!, content: String!): Event
    deleteComment(eventId: ID!, commentId: ID!): Event
    
  }
`;
module.exports = typeDefs;
