import express, { application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import initDB from "./src/models/initDB.js";
import todoRoutes from "./src/routes/todos.js";
import authRoutes from "./src/routes/auth.js";
import healthRoutes from "./src/routes/health.js";


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
app.use("/api/health", healthRoutes);
const PORT = process.env.PORT;


initDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to initialize database:", err);
    process.exit(1);
  });


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
