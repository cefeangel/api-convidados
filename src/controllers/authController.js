const authService = require('../services/authService');
const { validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

class AuthController {
  async login(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError(errors.array()[0].msg, 400);
    }

    const { email, senha } = req.body;
    const result = await authService.login(email, senha);
    res.status(200).json(result);
  }
}

module.exports = new AuthController();
