import mongoose from "mongoose";
import { userSchema } from "./user";

const complaintSchema = new mongoose.Schema({
  issuer: userSchema,
  address: {
    type: String,
    required: true,
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
