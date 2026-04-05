import express, { application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import db from "./src/db.js";
import todoRoutes from "./src/routes/todos.js";
import authRoutes from "./src/routes/auth.js";

dotenv.config();
const allowedOrigins = [
  "https://awesome-todo-app-seven.vercel.app",
  "http://localhost:5173", // your local dev port
];
const app = express();
app.use(
  cors({
    origin: (origin, callback) => {
      if(!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      }
      else{
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials : true,
  }),
);
app.use(express.json());

app.use("/api/todos", todoRoutes);
app.use("/api/auth", authRoutes);
app.get("/health", (req, res) => res.json({ status: "ok" }));
const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
