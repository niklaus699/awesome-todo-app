import db from "../db.js";

export const getTodos = async (req, res) => {
  const result = await db.query("SELECT * FROM todos WHERE user_id = $1 ORDER BY position ASC", [req.user.id]);
  res.json(result.rows);
};

export const addTodo = async (req, res) => {
  const { text } = req.body;
  const result = await db.query(
    "INSERT INTO todos (text, user_id, position) VALUES ($1, $2, COALESCE((SELECT MAX(position) + 1 FROM todos WHERE user_id = $2), 0) ) RETURNING *",
    [text, req.user.id]
  );

  res.json(result.rows[0]);
};

export const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      "DELETE FROM todos WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "404, todo not found" });
    }
    res.sendStatus(203);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "500 Internal server error" });
  }
};

export const toggleTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      "UPDATE todos SET completed = NOT completed WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Unable to update todo" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("error", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const reorderTodos = async (req, res) => {
  const { orderedIds } = req.body;
  const client = db.connect();
  try {
    (await client).query("BEGIN");

    for (let i = 0; i < orderedIds.length; i++ ) {
      (await client).query("UPDATE todos SET position = $1 WHERE id = $2 AND user_id = $3", [i, orderedIds[i], req.user.id]);
    }

    await (await client).query("COMMIT");
    res.sendStatus(200);

  } catch (error) {
    console.error(error);
    await (await client).query("ROLLBACK");
    res
      .sendStatus(500)
      .json({ message: "Reorder failed, check console for error message" });
  }
  finally {
    (await client).release();
  }
};
