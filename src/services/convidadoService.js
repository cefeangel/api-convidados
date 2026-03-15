const convidadoRepository = require('../repositories/convidadoRepository');
const eventoRepository = require('../repositories/eventoRepository');
const acompanhanteRepository = require('../repositories/acompanhanteRepository');
const AppError = require('../utils/AppError');

class ConvidadoService {
  async validarPertencimento(evento_id, usuario_id) {
    // Check if the event exists and belongs to the user
    const evento = await eventoRepository.findByIdAndUserId(evento_id, usuario_id);
    if (!evento) {
      throw new AppError('Lista de Evento não encontrada ou você não tem permissão.', 404);
    }
    return evento;
  }

  async testarLimites(evento_id, usuario_id, acompanhantesCount, isConfirmando = false) {
    const evento = await this.validarPertencimento(evento_id, usuario_id);

    // 1. Validar quantidade máxima de acompanhantes por convidado base do Evento
    if (acompanhantesCount > evento.maximo_acompanhantes_por_convidado) {
      throw new AppError(`O limite de acompanhantes por convidado é ${evento.maximo_acompanhantes_por_convidado}.`, 400);
    }

    // 2. Validar limite agregado da lista, SOMENTE se estiver confirmando
    if (isConfirmando) {
      // 1 (o proprio convidado) + acompanhantes dele
      const qtdeAdicionando = 1 + acompanhantesCount;
      const vagasDisponiveis = evento.maximo_convidados - evento.quantidade_total_convidados;

      if (qtdeAdicionando > vagasDisponiveis) {
        throw new AppError(`Limite de vagas excedido. A lista possui ${evento.quantidade_total_convidados} confirmados e o máximo é ${evento.maximo_convidados}.`, 400);
      }
    }

    return evento;
  }

  async createConvidado(usuario_id, evento_id, convidadoData) {
    const acompanhantes = convidadoData.acompanhantes || [];
    
    // Check constraints before inserting
    await this.testarLimites(evento_id, usuario_id, acompanhantes.length, convidadoData.confirmado);

    const payload = {
      lista_evento_id: evento_id,
      nome: convidadoData.nome,
      telefone: convidadoData.telefone,
      confirmado: convidadoData.confirmado || false
    };

    const id = await convidadoRepository.createWithAcompanhantes(payload, acompanhantes);
    return await convidadoRepository.findById(id);
  }

  async getAllConvidados(usuario_id, evento_id, status = null) {
    await this.validarPertencimento(evento_id, usuario_id);
    return await convidadoRepository.findAllByEventoId(evento_id, status);
  }

  async confirmarConvidado(usuario_id, evento_id, convidado_id, isConfirmado) {
    await this.validarPertencimento(evento_id, usuario_id);

    const convidado = await convidadoRepository.findById(convidado_id);
    if (!convidado || convidado.lista_evento_id !== parseInt(evento_id)) {
      throw new AppError('Convidado não encontrado nesta lista.', 404);
    }

    // If changing from pendent to confirmed, we must test bounds
    if (isConfirmado && !convidado.confirmado) {
        // Here we test if turning this guest and his acompanhantes into "Confirmed" will breach the lists maximum
        await this.testarLimites(evento_id, usuario_id, convidado.acompanhantes.length, true);
    }

    await convidadoRepository.updateConfirmacao(convidado_id, isConfirmado);
    return await convidadoRepository.findById(convidado_id);
  }

  async updateConvidado(usuario_id, evento_id, convidado_id, convidadoData) {
    await this.validarPertencimento(evento_id, usuario_id);

    const convidado = await convidadoRepository.findById(convidado_id);
    if (!convidado || convidado.lista_evento_id !== parseInt(evento_id)) {
      throw new AppError('Convidado não encontrado nesta lista.', 404);
    }

    const payload = {
      nome: convidadoData.nome || convidado.nome,
      telefone: convidadoData.telefone || convidado.telefone
    };

    await convidadoRepository.update(convidado_id, payload);
    return await convidadoRepository.findById(convidado_id);
  }

  async deleteConvidado(usuario_id, evento_id, convidado_id) {
    await this.validarPertencimento(evento_id, usuario_id);

    const convidado = await convidadoRepository.findById(convidado_id);
    if (!convidado || convidado.lista_evento_id !== parseInt(evento_id)) {
      throw new AppError('Convidado não encontrado nesta lista.', 404);
    }

    return await convidadoRepository.delete(convidado_id);
  }

  async addAcompanhante(usuario_id, evento_id, convidado_id, acompanhanteData) {
    await this.validarPertencimento(evento_id, usuario_id);
    
    const convidado = await convidadoRepository.findById(convidado_id);
    if (!convidado || convidado.lista_evento_id !== parseInt(evento_id)) {
      throw new AppError('Convidado não encontrado nesta lista.', 404);
    }

    // Validate limits: 1 (existing guest) + current companions + 1 new
    const newTotalCompanions = convidado.acompanhantes.length + 1;
    await this.testarLimites(evento_id, usuario_id, newTotalCompanions, convidado.confirmado);

    const acompId = await acompanhanteRepository.create(convidado_id, acompanhanteData.nome);
    return await convidadoRepository.findById(convidado_id);
  }

  async updateAcompanhante(usuario_id, evento_id, convidado_id, acompanhante_id, acompanhanteData) {
    await this.validarPertencimento(evento_id, usuario_id);
    
    const convidado = await convidadoRepository.findById(convidado_id);
    if (!convidado || convidado.lista_evento_id !== parseInt(evento_id)) {
      throw new AppError('Convidado não encontrado nesta lista.', 404);
    }

    const acomp = await acompanhanteRepository.findById(acompanhante_id);
    if (!acomp || acomp.convidado_id !== parseInt(convidado_id)) {
      throw new AppError('Acompanhante não encontrado para este convidado.', 404);
    }

    await acompanhanteRepository.update(acompanhante_id, acompanhanteData.nome);
    return await convidadoRepository.findById(convidado_id);
  }

  async deleteAcompanhante(usuario_id, evento_id, convidado_id, acompanhante_id) {
    await this.validarPertencimento(evento_id, usuario_id);
    
    const convidado = await convidadoRepository.findById(convidado_id);
    if (!convidado || convidado.lista_evento_id !== parseInt(evento_id)) {
      throw new AppError('Convidado não encontrado nesta lista.', 404);
    }

    const acomp = await acompanhanteRepository.findById(acompanhante_id);
    if (!acomp || acomp.convidado_id !== parseInt(convidado_id)) {
      throw new AppError('Acompanhante não encontrado para este convidado.', 404);
    }

    await acompanhanteRepository.deleteById(acompanhante_id);
    return await convidadoRepository.findById(convidado_id);
  }
}

module.exports = new ConvidadoService();
