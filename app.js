import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";   //this is for link between client and api 
import authRooter from "./Router/auth.js";
import UserRoot from "./Router/users.js"
import PostRoot from "./Router/Post.js"



const app = express();

const PORT = 3000;

app.listen(PORT,()=>{console.log(`server is running on port : ${PORT}`)});

app.use(cors({
    origin: process.env.CLIENT_URL, // Replace with the allowed origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    credentials: true // Allow credentials if needed
}))
app.use(express.json());
dotenv.config();
app.use(cookieParser());

app.use("/api/auth/",authRooter);
app.use("/api/user/",UserRoot);
app.use("/api/Post/",PostRoot);
