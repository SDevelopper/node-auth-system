const { pool } = require('../config/db');

async function findById(userId) {
  const [rows] = await pool.execute(
    'SELECT customer_id, firstname, lastname, email, telephone, role, token FROM oc_customer WHERE customer_id = ? LIMIT 1',
    [userId]
  );
  return rows[0] || null;
}

async function findForAuth(email) {
  const [rows] = await pool.execute(
    'SELECT customer_id, firstname, lastname, email, password, telephone, role, token FROM oc_customer WHERE email = ? LIMIT 1',
    [email]
  );
  return rows[0] || null;
}

async function findByTelephone(telephone) {
  const [rows] = await pool.execute(
    'SELECT 1 FROM oc_customer WHERE telephone = ? LIMIT 1',
    [telephone]
  );
  return rows[0] || null;
}

async function findByEmail(email) {
  const [rows] = await pool.execute(
    'SELECT 1 FROM oc_customer WHERE email = ? LIMIT 1',
    [email]
  );
  return rows[0] || null;
}

async function create(userData) {
  const { name, email, password, ...optionalFields } = userData;

  const sql = `
    INSERT INTO users_table 
    (
      name_col, 
      email_col, 
      password_col, 
      status, 
      created_at
    ) 
    VALUES (?, ?, ?, 1, NOW())
  `;

  const [result] = await pool.execute(sql, [
    name, 
    email, 
    password
  ]);

  return { 
    id: result.insertId, 
    name: name 
  };
}

async function saveToken(userId, tokenValue) {
  await pool.execute(
    'UPDATE oc_customer SET token = ? WHERE customer_id = ?',
    [tokenValue, userId]
  );
}

module.exports = {
  findById,
  findForAuth,
  findByEmail,
  findByTelephone,
  create,
  saveToken
};
