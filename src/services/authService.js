const userRepository = require('../repositories/userRepository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

class AuthService {
  async login(email, senha) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new AppError('Credenciais inválidas.', 401);
    }

    const isMatch = await bcrypt.compare(senha, user.senha);
    if (!isMatch) {
      throw new AppError('Credenciais inválidas.', 401);
    }

    // Generate JWT token
    const secret = process.env.JWT_SECRET || 'super_secret_key_development_only';
    const expiresIn = process.env.JWT_EXPIRES_IN || '1d';

    const token = jwt.sign(
      { id: user.id, email: user.email },
      secret,
      { expiresIn }
    );

    return {
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email
      },
      token
    };
  }
}

module.exports = new AuthService();
