import "dotenv/config";
import app from "./app.js";
import { dbConnect } from "./config/dbConnect.js";

const PORT = process.env.PORT || 4001;

app.listen(PORT, async () => {
    await dbConnect();
    console.log(`Server is Running at: http://localhost:${PORT}`)
})