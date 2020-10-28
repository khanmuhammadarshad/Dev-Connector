const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURL");

const connectDb = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log("MongoDb Connected");
  } catch (error) {
    console.log("errerwerwer werwe", error);
    process.exit(1);
  }
};
module.exports = connectDb;
