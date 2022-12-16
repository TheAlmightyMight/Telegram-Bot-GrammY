import mongoose from "mongoose";

export const suggestionSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
});

export default mongoose.model("suggestions", suggestionSchema);
