class AcompanhanteModel {
  constructor(id, convidado_id, nome, data_criacao) {
    this.id = id;
    this.convidado_id = convidado_id;
    this.nome = nome;
    this.data_criacao = data_criacao;
  }
}

module.exports = AcompanhanteModel;
