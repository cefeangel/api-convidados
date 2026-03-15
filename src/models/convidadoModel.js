class ConvidadoModel {
  constructor(id, lista_evento_id, nome, telefone, confirmado, data_criacao, data_atualizacao, acompanhantes = []) {
    this.id = id;
    this.lista_evento_id = lista_evento_id;
    this.nome = nome;
    this.telefone = telefone;
    this.confirmado = !!confirmado; // force boolean
    this.data_criacao = data_criacao;
    this.data_atualizacao = data_atualizacao;
    // Helper to nest acompanhantes right inside the guest obj
    this.acompanhantes = acompanhantes;
  }
}

module.exports = ConvidadoModel;
