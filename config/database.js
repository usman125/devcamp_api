const mongoose = require("mongoose");

const connectDB = async () => {
  // connect mongodb
  const conn = await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });
  console.log(
    `MongoDB Connected: ${(await conn).connection.host}`.cyan.underline.bold
  );
};

module.exports = connectDB;
