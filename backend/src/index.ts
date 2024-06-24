import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import mongoose from 'mongoose';
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import userRoutes from "./routes/users";
import authRoutes from "./routes/auth";
import myhotelroutes from "./routes/my-hotels";
import hotelRoutes from "./routes/hotels";


cloudinary.config({
    cloud_name: process.env.CLOUDUNARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_KEY_SECRET,
});

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string);

const app = express();

app.use(cookieParser());
//parse request body into json
app.use(express.json());
//parse url to get query parameters
app.use(express.urlencoded({ extended: true }));
//prevent request from certain urls and allowed url must include cookie
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));

app.use(express.static(path.join(__dirname, "../../frontend/dist")));

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/my-hotels", myhotelroutes);
app.use("/api/hotels", hotelRoutes);
app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
});

app.listen(8000, () => console.log("server running on port 8000"));