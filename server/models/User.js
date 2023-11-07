const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: [/.+@.+\..+/, "Must use a valid email address"],
  },
  // primary role does not exclude hosts as guests
  role: {
    type: String,
    enum: ["Host", "Guest"],
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    // temporarily commented out for ease of testing only

    // match: [
    //   /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,1024}$/,
    //   'invalid password',
    // ], // spec char, numb, capital
  },

  hostedEvents: [
    {
      type: Schema.Types.ObjectId,
      ref: "Event",
    },
  ],
  guestEvents: [
    {
      type: Schema.Types.ObjectId,
      ref: "Event",
    },
  ],
 
});

userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

// custom method to compare and validate password for logging in
userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = model("User", userSchema);

module.exports = User;
