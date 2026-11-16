import app from "./app.js";
import "dotenv/config";
import { dbConnect } from "./config/db.js";


const PORT = process.env.PORT || 4000;

app.listen(PORT, async () => {
  await dbConnect();
  console.log(`Server at port http://localhost:${PORT}`);
});
