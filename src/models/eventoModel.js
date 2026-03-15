class EventoModel {
  constructor(id, usuario_id, nome, maximo_convidados, maximo_acompanhantes_por_convidado, data_criacao, data_atualizacao, quantidade_total_convidados = 0) {
    this.id = id;
    this.usuario_id = usuario_id;
    this.nome = nome;
    this.maximo_convidados = maximo_convidados;
    this.maximo_acompanhantes_por_convidado = maximo_acompanhantes_por_convidado;
    this.data_criacao = data_criacao;
    this.data_atualizacao = data_atualizacao;
    this.quantidade_total_convidados = quantidade_total_convidados;
  }
}

module.exports = EventoModel;
