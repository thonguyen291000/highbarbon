const mongoose = require("mongoose");
require("dotenv").config();

async function connectDatabase() {
  try {
    await mongoose.connect(process.env.DB_HTTP, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Bad connection");
    console.log(error);
  }
}

module.exports = { connectDatabase };
