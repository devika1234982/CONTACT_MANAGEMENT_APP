import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import contactRoutes from "./routes/contactRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config(); //read values from .env file

connectDB();

const app = express();//express initialization

app.use(express.json());//to read json data sent frm frntend

app.use(express.static(path.join(__dirname, "./public"))); //to access frntend from public folder

app.use("/api", contactRoutes);

const PORT = process.env.PORT || 5006

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));