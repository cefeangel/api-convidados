const userRepository = require('../repositories/userRepository');
const bcrypt = require('bcrypt');
const AppError = require('../utils/AppError');

class UserService {
  async createUser(userData) {
    const { nome, email, senha } = userData;

    // Check if user already exists
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new AppError('E-mail já está em uso.', 409);
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(senha, saltRounds);

    // Create user object and save
    const newUser = {
      nome,
      email,
      senha: hashedPassword
    };

    const id = await userRepository.create(newUser);
    return { id, nome, email };
  }

  async getAllUsers() {
    return await userRepository.findAll();
  }

  async getUserById(id) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new AppError('Usuário não encontrado.', 404);
    }
    // Remove password before returning
    const { senha, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateUser(id, updateData) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new AppError('Usuário não encontrado.', 404);
    }

    // If updating email, check uniqueness
    if (updateData.email && updateData.email !== user.email) {
      const emailExists = await userRepository.findByEmail(updateData.email);
      if (emailExists) {
        throw new AppError('E-mail já está em uso.', 409);
      }
    }

    // Prepare update payload blending exist records
    const payload = {
      nome: updateData.nome || user.nome,
      email: updateData.email || user.email,
      senha: user.senha // default keep old password
    };

    // If new password is provided
    if (updateData.senha) {
      const saltRounds = 10;
      payload.senha = await bcrypt.hash(updateData.senha, saltRounds);
    }

    const success = await userRepository.update(id, payload);
    return success;
  }

  async deleteUser(id) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new AppError('Usuário não encontrado.', 404);
    }
    
    return await userRepository.delete(id);
  }
}

module.exports = new UserService();
