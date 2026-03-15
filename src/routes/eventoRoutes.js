const express = require('express');
const router = express.Router();
const eventoController = require('../controllers/eventoController');
const authMiddleware = require('../middlewares/authMiddleware');
const { validateEvento, validateEventoUpdate } = require('../middlewares/eventoValidation');
const catchAsync = require('../utils/catchAsync');
const convidadoRoutes = require('./convidadoRoutes');

// ===== Rotas Protegidas =====
// Todas as rotas de eventos exigem usuário logado
router.use(authMiddleware);

// Nested routes for Convidados passing the parent route params downwards
router.use('/:evento_id/convidados', convidadoRoutes);

/**
 * @swagger
 * tags:
 *   name: Eventos
 *   description: Gestão das Listas de Evento
 */

/**
 * @swagger
 * /api/eventos:
 *   post:
 *     summary: Cria uma nova lista de convidados em branco.
 *     tags: [Eventos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               maximo_convidados:
 *                 type: integer
 *               maximo_acompanhantes_por_convidado:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Lista criada com sucesso
 */
router.post('/', validateEvento, catchAsync(eventoController.create));

/**
 * @swagger
 * /api/eventos:
 *   get:
 *     summary: Lista todos os eventos organizados pelo usuário logado.
 *     tags: [Eventos]
 *     responses:
 *       200:
 *         description: Retorna array ordenado de Eventos
 */
router.get('/', catchAsync(eventoController.index));

/**
 * @swagger
 * /api/eventos/{id}:
 *   get:
 *     summary: Exibe as configurações de uma lista de evento específica.
 *     tags: [Eventos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Evento encontrado
 */
router.get('/:id', catchAsync(eventoController.show));

/**
 * @swagger
 * /api/eventos/{id}/relatorio:
 *   get:
 *     summary: Retorna estatísticas reais e agregadas da lista (Dashboards).
 *     tags: [Eventos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Dashboard consolidado retornado
 */
router.get('/:id/relatorio', catchAsync(eventoController.relatorio));

/**
 * @swagger
 * /api/eventos/{id}:
 *   put:
 *     summary: Modifica parâmetros e os limites de um evento.
 *     tags: [Eventos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               maximo_convidados:
 *                 type: integer
 *               maximo_acompanhantes_por_convidado:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Atualizado com sucesso
 */
router.put('/:id', validateEventoUpdate, catchAsync(eventoController.update));

/**
 * @swagger
 * /api/eventos/{id}:
 *   delete:
 *     summary: Exclui a lista por completo.
 *     tags: [Eventos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Excluído com sucesso
 */
router.delete('/:id', catchAsync(eventoController.delete));

module.exports = router;
