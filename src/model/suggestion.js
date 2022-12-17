import mongoose from "mongoose";
import { userSchema } from "./user.js";

export const suggestionSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  user: userSchema,
});

export default mongoose.model("suggestions", suggestionSchema);
