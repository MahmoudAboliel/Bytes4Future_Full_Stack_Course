import pool from "../confid/pg.js";

class User {
  constructor() {}

  createUsersTable = async () => {
    const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      family VARCHAR(100) UNIQUE NOT NULL,
      age INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
    await pool.query(query);
  };

  find = async () => {
    const result = await pool.query("SELECT * FROM users ORDER BY id");
    return result.rows;
  };

  findById = async (id) => {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    return result.rows[0];
  };

  create = async ({ name, family, age }) => {
    const result = await pool.query(
      "INSERT INTO users (name, family, age) VALUES ($1, $2, $3) RETURNING *",
      [name, family, age],
    );
    return result.rows[0];
  };

  findByIdAndUpdate = async (id, { name, family, age }) => {
    const result = await pool.query(
      "UPDATE users SET name = $1, email = $2, age = $3 WHERE id = $4 RETURNING *",
      [name, family, age, id],
    );
    return result.rows[0];
  };

  delete = async (id) => {
    const result = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING *",
      [id],
    );
    return result.rows[0];
  };
}

export default new User();
