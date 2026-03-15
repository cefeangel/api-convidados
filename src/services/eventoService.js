const eventoRepository = require('../repositories/eventoRepository');
const AppError = require('../utils/AppError');

class EventoService {
  async createEvento(usuario_id, eventoData) {
    const { nome, maximo_convidados, maximo_acompanhantes_por_convidado } = eventoData;

    const novoEvento = {
      usuario_id,
      nome,
      maximo_convidados,
      maximo_acompanhantes_por_convidado: maximo_acompanhantes_por_convidado || 0,
    };

    const id = await eventoRepository.create(novoEvento);
    return await eventoRepository.findByIdAndUserId(id, usuario_id);
  }

  async getAllEventos(usuario_id) {
    return await eventoRepository.findAllByUserId(usuario_id);
  }

  async getEventoById(id, usuario_id) {
    const evento = await eventoRepository.findByIdAndUserId(id, usuario_id);
    if (!evento) {
      throw new AppError('Lista de Evento não encontrada.', 404);
    }
    return evento;
  }

  async getRelatorio(id, usuario_id) {
    const relatorio = await eventoRepository.getRelatorio(id, usuario_id);
    if (!relatorio) {
      throw new AppError('Lista de Evento não encontrada.', 404);
    }
    return relatorio;
  }

  async updateEvento(id, usuario_id, updateData) {
    const eventoAtual = await eventoRepository.findByIdAndUserId(id, usuario_id);
    if (!eventoAtual) {
      throw new AppError('Lista de Evento não encontrada.', 404);
    }

    const payload = {
      nome: updateData.nome !== undefined ? updateData.nome : eventoAtual.nome,
      maximo_convidados: updateData.maximo_convidados !== undefined ? updateData.maximo_convidados : eventoAtual.maximo_convidados,
      maximo_acompanhantes_por_convidado: updateData.maximo_acompanhantes_por_convidado !== undefined ? updateData.maximo_acompanhantes_por_convidado : eventoAtual.maximo_acompanhantes_por_convidado,
    };

    await eventoRepository.update(id, usuario_id, payload);
    return await eventoRepository.findByIdAndUserId(id, usuario_id);
  }

  async deleteEvento(id, usuario_id) {
    const evento = await eventoRepository.findByIdAndUserId(id, usuario_id);
    if (!evento) {
      throw new AppError('Lista de Evento não encontrada.', 404);
    }
    await eventoRepository.delete(id, usuario_id);
    return true;
  }
}

module.exports = new EventoService();
