const convidadoService = require('../services/convidadoService');
const { validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

class ConvidadoController {
  async create(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError(errors.array()[0].msg, 400);
    }

    const evento_id = req.params.evento_id;
    const convidado = await convidadoService.createConvidado(req.userId, evento_id, req.body);
    res.status(201).json({ message: 'Convidado cadastrado com sucesso', convidado });
  }

  async index(req, res) {
    const evento_id = req.params.evento_id;
    const status = req.query.status; // 'confirmados' or 'pendentes'
    const convidados = await convidadoService.getAllConvidados(req.userId, evento_id, status);
    res.status(200).json(convidados);
  }

  async confirmar(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError(errors.array()[0].msg, 400);
    }

    const { evento_id, id } = req.params;
    const { confirmado } = req.body;

    const convidadoAtualizado = await convidadoService.confirmarConvidado(req.userId, evento_id, id, confirmado);
    res.status(200).json({ 
      message: confirmado ? 'Presença confirmada!' : 'Presença desmarcada.', 
      convidado: convidadoAtualizado 
    });
  }

  async update(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError(errors.array()[0].msg, 400);
    }

    const { evento_id, id } = req.params;
    const convidadoAtualizado = await convidadoService.updateConvidado(req.userId, evento_id, id, req.body);
    res.status(200).json({ 
      message: 'Dados do convidado atualizados!', 
      convidado: convidadoAtualizado 
    });
  }

  async delete(req, res) {
    const { evento_id, id } = req.params;
    await convidadoService.deleteConvidado(req.userId, evento_id, id);
    res.status(200).json({ message: 'Convidado removido com sucesso' });
  }

  async addAcompanhante(req, res) {
    const { evento_id, id } = req.params;
    const convidado = await convidadoService.addAcompanhante(req.userId, evento_id, id, req.body);
    res.status(201).json(convidado);
  }

  async updateAcompanhante(req, res) {
    const { evento_id, id, acomp_id } = req.params;
    const convidado = await convidadoService.updateAcompanhante(req.userId, evento_id, id, acomp_id, req.body);
    res.status(200).json(convidado);
  }

  async deleteAcompanhante(req, res) {
    const { evento_id, id, acomp_id } = req.params;
    const convidado = await convidadoService.deleteAcompanhante(req.userId, evento_id, id, acomp_id);
    res.status(200).json(convidado);
  }
}

module.exports = new ConvidadoController();
