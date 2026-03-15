const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const { validateUserRegistration, validateUserUpdate } = require('../middlewares/userValidation');
const catchAsync = require('../utils/catchAsync');

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Gestão de Contas de Usuários
 */

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Cria uma nova conta. (Público)
 *     tags: [Usuarios]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       201:
 *         description: Criado com sucesso
 */
// ===== Rotas Públicas =====
// Cadastro do primeiro usuário (ou de qualquer usuário público sem token)
router.post('/', validateUserRegistration, catchAsync(userController.register));

// ===== Rotas Protegidas =====
// Aplica o middleware de autenticacao para todas as rotas abaixo desta linha
router.use(authMiddleware);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Lista todos os usuários.
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista retornada
 */
router.get('/', catchAsync(userController.index));

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Retorna um usuário pelo ID.
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuário encontrado
 */
router.get('/:id', catchAsync(userController.show));

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Atualiza um usuário.
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Atualizado com sucesso
 */
router.put('/:id', validateUserUpdate, catchAsync(userController.update));

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Deleta a conta de um usuário.
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deletado com sucesso
 */

router.get('/', catchAsync(userController.index));
router.get('/:id', catchAsync(userController.show));
router.put('/:id', validateUserUpdate, catchAsync(userController.update));
router.delete('/:id', catchAsync(userController.delete));

module.exports = router;
