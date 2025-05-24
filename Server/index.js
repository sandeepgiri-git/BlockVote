import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoute from "./routes/userRoute.js"
import electionRoute from "./routes/electionRoute.js"
import aadharRoute from "./routes/aadharRoute.js"

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 30000, // 30 seconds
    socketTimeoutMS: 45000,
}).then(() => console.log('MongoDB connected'));

app.use("/api/user",userRoute);
app.use("/api/election",electionRoute);
app.use("/api/aadhar",aadharRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));