const db = require('../config/database');
const AcompanhanteModel = require('../models/acompanhanteModel');

class AcompanhanteRepository {
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

  async create(convidado_id, nome) {
    const sql = `INSERT INTO acompanhantes (convidado_id, nome) VALUES (?, ?)`;
    const result = await this.runQuery(sql, [convidado_id, nome]);
    return result.lastID;
  }

  async findByConvidadoId(convidado_id) {
    const sql = `SELECT id, convidado_id, nome, data_criacao FROM acompanhantes WHERE convidado_id = ?`;
    const rows = await this.allQuery(sql, [convidado_id]);
    return rows.map(r => new AcompanhanteModel(r.id, r.convidado_id, r.nome, r.data_criacao));
  }

  async findById(id) {
    const sql = `SELECT * FROM acompanhantes WHERE id = ?`;
    const row = await this.getQuery(sql, [id]);
    if (!row) return null;
    return new AcompanhanteModel(row.id, row.convidado_id, row.nome, row.data_criacao);
  }

  async getQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  async update(id, nome) {
    const sql = `UPDATE acompanhantes SET nome = ? WHERE id = ?`;
    const result = await this.runQuery(sql, [nome, id]);
    return result.changes > 0;
  }

  async deleteById(id) {
    const sql = `DELETE FROM acompanhantes WHERE id = ?`;
    const result = await this.runQuery(sql, [id]);
    return result.changes > 0;
  }

  async deleteByConvidadoId(convidado_id) {
    const sql = `DELETE FROM acompanhantes WHERE convidado_id = ?`;
    const result = await this.runQuery(sql, [convidado_id]);
    return result.changes;
  }
}

module.exports = new AcompanhanteRepository();
