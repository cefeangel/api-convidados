const userService = require('../services/userService');
const { validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

class UserController {
  async register(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError(errors.array()[0].msg, 400);
    }

    const newUser = await userService.createUser(req.body);
    res.status(201).json({ message: 'Usuário cadastrado com sucesso', user: newUser });
  }

  async index(req, res) {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  }

  async show(req, res) {
    const user = await userService.getUserById(req.params.id);
    res.status(200).json(user);
  }

  async update(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError(errors.array()[0].msg, 400);
    }

    await userService.updateUser(req.params.id, req.body);
    res.status(200).json({ message: 'Usuário atualizado com sucesso' });
  }

  async delete(req, res) {
    await userService.deleteUser(req.params.id);
    res.status(200).json({ message: 'Usuário removido com sucesso' });
  }
}

module.exports = new UserController();
