const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema(
  {
    task: {
      type: String,
      require: [true, "please provide the task"],
    },
    status: {
      type: Boolean,
      require: [true, "please provide the status"],
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Todo = mongoose.model["Todo"] || mongoose.model(`Todo`, todoSchema);

module.exports = Todo;
