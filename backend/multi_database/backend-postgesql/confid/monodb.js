import mongoose from "mongoose";
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(
      "Mongo DB is connect Successfully at server " + process.env.MONGO_URI,
    );
  } catch (err) {
    console.error("Failed to connect Data Base " + err);
    process.exit(1);
  }
};
export default connectDB;
