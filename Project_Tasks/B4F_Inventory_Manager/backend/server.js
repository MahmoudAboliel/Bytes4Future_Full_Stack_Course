import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/mongodb.js";

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  await connectDB();
  console.log(`server is running: http://localhost:${PORT}`);
});
