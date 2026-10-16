import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("conneted to mongodb successfully " + process.env.MONGO_URI);
  } catch (err) {
    console.error("faild to connect to mongodb " + err);
  }
};

export default connectDB;
