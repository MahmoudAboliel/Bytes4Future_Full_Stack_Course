import app from "./app.js";
import "dotenv/config";
import { mongoConnect } from "./config/mongoConnect.js";

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    await mongoConnect();
  console.log(`Server is running on port ${PORT}`);
});