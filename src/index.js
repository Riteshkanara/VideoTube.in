import mongoose from "mongoose";
import dotenv from "dotenv";
import cconnectDB from "./db/index.js";

dotenv.config({
    path:'./env'
})

cconnectDB()























// THE FIRST APPROACH FOR THE DB CONNECTION AND SERVER SETUP---

// import express from "express"
// const app = express()
// (async () => {
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//         console.log("MongoDB connected successfully");
        
//         app.on("error", (error) => {
//             console.log("ERROR", error);
//             throw error;
//         });
        
//         app.listen(process.env.PORT, () => {
//             console.log(`Server is running on PORT ${process.env.PORT}`);
            
//         });
        
//     } catch (error) {
//         console.error("Database connection error:", error);
//         throw error;
//     }
// })();