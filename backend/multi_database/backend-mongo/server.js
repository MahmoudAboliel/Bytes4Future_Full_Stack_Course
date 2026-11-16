import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./confid/monodb.js";

dotenv.config();
const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  await connectDB();
  console.log(`server is running: http://localhost:${PORT}`);
});
