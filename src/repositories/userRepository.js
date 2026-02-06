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

async function create({ name, lastname, telephone, email, password, ip }) {
  const sql = `
    INSERT INTO users 
    (
      name, 
      lastname, 
      telephone, 
      email, 
      password, 
      ip
    ) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const [result] = await pool.execute(sql, [
    name, 
    lastname, 
    telephone, 
    email, 
    password, 
    ip
  ]);

  return { 
    id: result.insertId, 
    name,
    email 
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
