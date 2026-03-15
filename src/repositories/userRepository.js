const db = require('../config/database');
const UserModel = require('../models/userModel');

class UserRepository {
  // Executar query que não retorna dados (INSERT, UPDATE, DELETE)
  async runQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this);
        }
      });
    });
  }

  // Executar query que retorna vários registros (SELECT)
  async allQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Executar query que retorna um único registro (SELECT)
  async getQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  async create(user) {
    const sql = `INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)`;
    const result = await this.runQuery(sql, [user.nome, user.email, user.senha]);
    return result.lastID; // Returns the newly generated ID
  }

  async findByEmail(email) {
    const sql = `SELECT * FROM usuarios WHERE email = ?`;
    const row = await this.getQuery(sql, [email]);
    if (!row) return null;
    return new UserModel(row.id, row.nome, row.email, row.senha, row.data_criacao, row.data_atualizacao);
  }

  async findById(id) {
    const sql = `SELECT * FROM usuarios WHERE id = ?`;
    const row = await this.getQuery(sql, [id]);
    if (!row) return null;
    return new UserModel(row.id, row.nome, row.email, row.senha, row.data_criacao, row.data_atualizacao);
  }

  async findAll() {
    const sql = `SELECT id, nome, email, data_criacao, data_atualizacao FROM usuarios`;
    const rows = await this.allQuery(sql);
    // Para listas gerais, omitimos a senha por segurança
    return rows;
  }

  async update(id, userData) {
    const sql = `
      UPDATE usuarios 
      SET nome = ?, email = ?, senha = ?, data_atualizacao = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    const result = await this.runQuery(sql, [userData.nome, userData.email, userData.senha, id]);
    return result.changes > 0;
  }

  async delete(id) {
    const sql = `DELETE FROM usuarios WHERE id = ?`;
    const result = await this.runQuery(sql, [id]);
    return result.changes > 0;
  }
}

module.exports = new UserRepository();
