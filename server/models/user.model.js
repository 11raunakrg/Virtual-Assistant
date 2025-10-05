import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    assistantName: {
      type: String,
      default : 'Virtual Assistant'
    },

    assistantImage: {
      type: String,
    },

    history: [{ type: String }],
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
