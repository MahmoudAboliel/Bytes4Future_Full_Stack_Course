import { connect } from "mongoose";

export const dbConnect = async () => {
    try {
        await connect(process.env.MONGODB_URI);
        console.log("Mongo DB is Connected");
    } catch (error) {
        if (error instanceof Error)
            console.error(error.message)
        else console.log(error)
            
    }
}