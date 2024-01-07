const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      require: [true, "please provide the email"],
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model["User"] || mongoose.model(`User`, userSchema);

module.exports = User;
