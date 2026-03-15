const eventoService = require('../services/eventoService');
const { validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

class EventoController {
  async create(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError(errors.array()[0].msg, 400);
    }

    // req.userId depends on authMiddleware
    const evento = await eventoService.createEvento(req.userId, req.body);
    res.status(201).json({ message: 'Lista criada com sucesso', evento });
  }

  async index(req, res) {
    const eventos = await eventoService.getAllEventos(req.userId);
    res.status(200).json(eventos);
  }

  async show(req, res) {
    const evento = await eventoService.getEventoById(req.params.id, req.userId);
    res.status(200).json(evento);
  }

  async relatorio(req, res) {
    const relatorio = await eventoService.getRelatorio(req.params.id, req.userId);
    res.status(200).json(relatorio);
  }

  async update(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError(errors.array()[0].msg, 400);
    }

    const evento = await eventoService.updateEvento(req.params.id, req.userId, req.body);
    res.status(200).json({ message: 'Lista atualizada com sucesso', evento });
  }

  async delete(req, res) {
    await eventoService.deleteEvento(req.params.id, req.userId);
    res.status(200).json({ message: 'Lista removida com sucesso' });
  }
}

module.exports = new EventoController();
