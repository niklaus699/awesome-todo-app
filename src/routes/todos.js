import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import * as todos from "../controllers/todoController.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", todos.getTodos);
router.post("/", todos.addTodo);
router.put("/reorder", todos.reorderTodos);  // ✅ still before /:id
router.delete("/:id", todos.deleteTodo);
router.put("/:id", todos.toggleTodo);

export default router;
