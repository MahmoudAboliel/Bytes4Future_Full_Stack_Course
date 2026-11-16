import dotenv from "dotenv";
import app from "./app.js";
// import connectDB from "./confid/monodb.js";
import UserModelPG from "./models/UserModelPG.js";

dotenv.config();
const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  //await connectDB();
  await UserModelPG.createUsersTable();
  console.log(`server is running: http://localhost:${PORT}`);
});
