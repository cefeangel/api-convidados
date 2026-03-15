const db = require('../config/database');
const EventoModel = require('../models/eventoModel');

class EventoRepository {
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

  async create(evento) {
    const sql = `
      INSERT INTO listas_eventos (usuario_id, nome, maximo_convidados, maximo_acompanhantes_por_convidado)
      VALUES (?, ?, ?, ?)
    `;
    const params = [
      evento.usuario_id,
      evento.nome,
      evento.maximo_convidados,
      evento.maximo_acompanhantes_por_convidado,
    ];
    const result = await this.runQuery(sql, params);
    return result.lastID;
  }

  async findAllByUserId(usuario_id) {
    const sql = `
      SELECT e.id, e.usuario_id, e.nome, e.maximo_convidados, e.maximo_acompanhantes_por_convidado, 
             e.data_criacao, e.data_atualizacao,
             (
                SELECT COUNT(*) FROM convidados c WHERE c.lista_evento_id = e.id AND c.confirmado = 1
             ) + (
                SELECT COUNT(*) FROM acompanhantes a 
                INNER JOIN convidados c ON a.convidado_id = c.id
                WHERE c.lista_evento_id = e.id AND c.confirmado = 1
             ) as quantidade_total_convidados
      FROM listas_eventos e
      WHERE e.usuario_id = ?
    `;
    const rows = await this.allQuery(sql, [usuario_id]);
    
    return rows.map(row => 
      new EventoModel(
        row.id, row.usuario_id, row.nome, row.maximo_convidados, 
        row.maximo_acompanhantes_por_convidado, row.data_criacao, row.data_atualizacao,
        row.quantidade_total_convidados || 0
      )
    );
  }

  async findByIdAndUserId(id, usuario_id) {
    const sql = `
      SELECT e.id, e.usuario_id, e.nome, e.maximo_convidados, e.maximo_acompanhantes_por_convidado, 
             e.data_criacao, e.data_atualizacao,
             (
                SELECT COUNT(*) FROM convidados c WHERE c.lista_evento_id = e.id AND c.confirmado = 1
             ) + (
                SELECT COUNT(*) FROM acompanhantes a 
                INNER JOIN convidados c ON a.convidado_id = c.id
                WHERE c.lista_evento_id = e.id AND c.confirmado = 1
             ) as quantidade_total_convidados
      FROM listas_eventos e
      WHERE e.id = ? AND e.usuario_id = ?
    `;
    const row = await this.getQuery(sql, [id, usuario_id]);
    
    if (!row) return null;

    return new EventoModel(
      row.id, row.usuario_id, row.nome, row.maximo_convidados, 
      row.maximo_acompanhantes_por_convidado, row.data_criacao, row.data_atualizacao,
      row.quantidade_total_convidados || 0
    );
  }

  async update(id, usuario_id, data) {
    const sql = `
      UPDATE listas_eventos 
      SET nome = ?, maximo_convidados = ?, maximo_acompanhantes_por_convidado = ?, data_atualizacao = CURRENT_TIMESTAMP
      WHERE id = ? AND usuario_id = ?
    `;
    const params = [
      data.nome,
      data.maximo_convidados,
      data.maximo_acompanhantes_por_convidado,
      id,
      usuario_id
    ];
    const result = await this.runQuery(sql, params);
    return result.changes > 0;
  }

  async delete(id, usuario_id) {
    const sql = `DELETE FROM listas_eventos WHERE id = ? AND usuario_id = ?`;
    const result = await this.runQuery(sql, [id, usuario_id]);
    return result.changes > 0;
  }
  async getRelatorio(evento_id, usuario_id) {
    const evento = await this.findByIdAndUserId(evento_id, usuario_id);
    if (!evento) return null;

    const sqlConvidados = `
      SELECT 
        COUNT(id) as total_cadastrados,
        SUM(CASE WHEN confirmado = 1 THEN 1 ELSE 0 END) as confirmados,
        SUM(CASE WHEN confirmado = 0 THEN 1 ELSE 0 END) as nao_confirmados
      FROM convidados 
      WHERE lista_evento_id = ?
    `;

    const sqlAcompanhantes = `
      SELECT 
        COUNT(a.id) as total_acompanhantes,
        SUM(CASE WHEN c.confirmado = 1 THEN 1 ELSE 0 END) as acompanhantes_confirmados
      FROM acompanhantes a
      INNER JOIN convidados c ON a.convidado_id = c.id
      WHERE c.lista_evento_id = ?
    `;

    const statsConvidados = await this.getQuery(sqlConvidados, [evento_id]);
    const statsAcompanhantes = await this.getQuery(sqlAcompanhantes, [evento_id]);

    const total_cadastrados = statsConvidados.total_cadastrados || 0;
    const confirmados = statsConvidados.confirmados || 0;
    const nao_confirmados = statsConvidados.nao_confirmados || 0;
    const total_acompanhantes = statsAcompanhantes.total_acompanhantes || 0;
    const pessoas_confirmadas = confirmados + (statsAcompanhantes.acompanhantes_confirmados || 0);

    return {
      nome_lista: evento.nome,
      quantidade_total_convidados_cadastrados: total_cadastrados,
      quantidade_convidados_confirmados: confirmados,
      quantidade_convidados_nao_confirmados: nao_confirmados,
      quantidade_total_acompanhantes: total_acompanhantes,
      total_pessoas_confirmadas: pessoas_confirmadas
    };
  }
}

module.exports = new EventoRepository();
