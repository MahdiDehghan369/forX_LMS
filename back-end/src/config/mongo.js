const mongoose = require("mongoose");
const Logger = require('sillajLogger');

const connectMongoose = async () => {
  try {
    const mongoUri =
      `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASENAME}?replicaSet=rs0` ||
      "mongodb://127.0.0.1:27017/LMS?replicaSet=rs0";
    await mongoose.connect(mongoUri);
    Logger.info("MongoDB connected successfully");
  } catch (error) {
    Logger.error("MongoDB connection failed:", error);
    throw error;
  }
};

module.exports = connectMongoose;
