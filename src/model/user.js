import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  id: {
    type: Number,
    required: true,
  },
  banned: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("users", userSchema);
