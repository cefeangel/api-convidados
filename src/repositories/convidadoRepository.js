const db = require('../config/database');
const ConvidadoModel = require('../models/convidadoModel');
const acompanhanteRepository = require('./acompanhanteRepository');

class ConvidadoRepository {
  async runQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function (err) {
        if (err) reject(err);
        else resolve(this);
      });
    });
  }

  async allQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  async getQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  // Create Convidados and Acompanhantes together
  async createWithAcompanhantes(convidadoData, acompanhantes = []) {
    const sqlConvidado = `
      INSERT INTO convidados (lista_evento_id, nome, telefone, confirmado)
      VALUES (?, ?, ?, ?)
    `;
    const params = [
      convidadoData.lista_evento_id,
      convidadoData.nome,
      convidadoData.telefone,
      convidadoData.confirmado ? 1 : 0
    ];

    const result = await this.runQuery(sqlConvidado, params);
    const convidadoId = result.lastID;

    // Insert acompanhantes if any
    if (acompanhantes && acompanhantes.length > 0) {
      for (const acomp of acompanhantes) {
        await acompanhanteRepository.create(convidadoId, acomp.nome);
      }
    }

    return convidadoId;
  }

  async updateConfirmacao(id, confirmado) {
    const sql = `UPDATE convidados SET confirmado = ?, data_atualizacao = CURRENT_TIMESTAMP WHERE id = ?`;
    const result = await this.runQuery(sql, [confirmado ? 1 : 0, id]);
    return result.changes > 0;
  }

  async update(id, data) {
    const sql = `UPDATE convidados SET nome = ?, telefone = ?, data_atualizacao = CURRENT_TIMESTAMP WHERE id = ?`;
    const result = await this.runQuery(sql, [data.nome, data.telefone, id]);
    return result.changes > 0;
  }

  async findById(id) {
    const sql = `SELECT * FROM convidados WHERE id = ?`;
    const row = await this.getQuery(sql, [id]);
    
    if (!row) return null;

    // Fetch its acompanhantes
    const acompanhantes = await acompanhanteRepository.findByConvidadoId(row.id);
    
    return new ConvidadoModel(
      row.id, row.lista_evento_id, row.nome, row.telefone, 
      row.confirmado, row.data_criacao, row.data_atualizacao, acompanhantes
    );
  }

  async findAllByEventoId(lista_evento_id, status = null) {
    let sql = `SELECT * FROM convidados WHERE lista_evento_id = ?`;
    const params = [lista_evento_id];

    if (status === 'confirmados') {
      sql += ` AND confirmado = 1`;
    } else if (status === 'pendentes') {
      sql += ` AND confirmado = 0`;
    }

    sql += ` ORDER BY nome ASC`;
    
    const rows = await this.allQuery(sql, params);

    const result = [];
    for (const row of rows) {
      const acompanhantes = await acompanhanteRepository.findByConvidadoId(row.id);
      result.push(new ConvidadoModel(
        row.id, row.lista_evento_id, row.nome, row.telefone, 
        row.confirmado, row.data_criacao, row.data_atualizacao, acompanhantes
      ));
    }

    return result;
  }

  async delete(id) {
    // ON DELETE CASCADE automatically drops the acompanhantes from DB
    const sql = `DELETE FROM convidados WHERE id = ?`;
    const result = await this.runQuery(sql, [id]);
    return result.changes > 0;
  }
}

module.exports = new ConvidadoRepository();
