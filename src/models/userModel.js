class UserModel {
  constructor(id, nome, email, senha, data_criacao, data_atualizacao) {
    this.id = id;
    this.nome = nome;
    this.email = email;
    this.senha = senha;
    this.data_criacao = data_criacao;
    this.data_atualizacao = data_atualizacao;
  }
}

module.exports = UserModel;
