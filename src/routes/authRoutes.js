const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateLogin } = require('../middlewares/authValidation');
const catchAsync = require('../utils/catchAsync');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticação de Usuários
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Autentica o usuário e retorna o Token JWT.
 *     tags: [Auth]
 *     security: [] 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login bem sucedido
 *       400:
 *         description: Erro de validação
 *       401:
 *         description: Credenciais incorretas
 */
// POST /api/auth/login
router.post('/login', validateLogin, catchAsync(authController.login));

module.exports = router;
