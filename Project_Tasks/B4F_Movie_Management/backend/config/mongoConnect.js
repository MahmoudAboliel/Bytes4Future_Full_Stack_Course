import { connect } from "mongoose";

export const mongoConnect = async () => {
  try {
    await connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};