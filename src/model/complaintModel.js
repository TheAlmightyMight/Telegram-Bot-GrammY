import mongoose from "mongoose";
import { userSchema } from "./user.js";

const complaintSchema = new mongoose.Schema({
  issuer: userSchema,
  address: {
    type: String,
    default: "",
  },
  photo: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    required: true,
  },
});

export default mongoose.model("complaints", complaintSchema);
