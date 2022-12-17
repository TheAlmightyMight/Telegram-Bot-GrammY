import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();

// Models
import userModel from "./model/user.js";
import suggestionSchema from "./model/suggestion.js";
import complaintModel from "./model/complaintModel.js";

class DB {
  saveUser() {}
  updateUser() {}
  getUser() {}
  getAllUsers() {}
  saveComplaint() {}
  saveSuggestion() {}
  connect() {}
}

class DataBase extends DB {
  async saveUser(user) {
    await userModel.create(user);
  }

  async updateUser(filter, newUser) {
    await userModel.findOneAndUpdate(filter, newUser);
  }

  async getUser(filter) {
    const user = await userModel.findOne(filter).lean();
    return user;
  }

  async getAllUsers() {
    const users = await userModel.find({});
    return users;
  }

  async saveComplaint(complaint) {
    await complaintModel.create(complaint);
  }

  async saveSuggestion(suggestion) {
    await suggestionSchema.create(suggestion);
  }

  connect() {
    mongoose
      .connect(process.env.CONNECTION_STRING)
      .then(() => console.log("Connected to DataBase..."))
      .catch(err => console.log("Could not connect to MongoDB:" + err.message));

    mongoose.connection.on("error", err => {
      console.log("Unexpected DataBase error:" + err.message);
    });
  }
}

const db = new DataBase();

export default db;
