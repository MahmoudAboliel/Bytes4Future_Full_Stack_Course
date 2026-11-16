import { connect } from "mongoose";

export const dbConnect = async () => {
  try {
    await connect(process.env.DB_URI);
    console.log("Database is Running");
  } catch (err) {
    console.error("DB Error" + err.message);
    process.exit(1);
  }
};
