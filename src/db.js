import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();

// Models
import userModel from "./model/user.js";

class DB {
  saveUser() {}
  updateUser() {}
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

  saveComplaint() {}
  saveSuggestion() {}
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
