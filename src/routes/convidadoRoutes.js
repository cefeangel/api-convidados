const express = require('express');
const convidadoController = require('../controllers/convidadoController');
const authMiddleware = require('../middlewares/authMiddleware');
const { validateConvidado, validateConfirmacao } = require('../middlewares/convidadoValidation');
const catchAsync = require('../utils/catchAsync');

// Observe que estamos setando mergeParams no router para pegarmos os params da rota-pai (/api/eventos/:evento_id)
const router = express.Router({ mergeParams: true });

// Todas as rotas de convidados exigem usuário logado
router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Convidados
 *   description: Gestão de Pessoas nas Listas
 */

/**
 * @swagger
 * /api/eventos/{evento_id}/convidados:
 *   post:
 *     summary: Inclui convidados (e acompanhantes) num evento específico.
 *     tags: [Convidados]
 *     parameters:
 *       - in: path
 *         name: evento_id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               telefone:
 *                 type: string
 *                 example: (31) 99999-9999
 *               confirmado:
 *                 type: boolean
 *               acompanhantes:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     nome:
 *                       type: string
 *     responses:
 *       201:
 *         description: Lista criada com sucesso
 */
// POST /api/eventos/:evento_id/convidados
router.post('/', validateConvidado, catchAsync(convidadoController.create));

/**
 * @swagger
 * /api/eventos/{evento_id}/convidados:
 *   get:
 *     summary: Extraí nominalmente os convidados de uma lista.
 *     tags: [Convidados]
 *     parameters:
 *       - in: path
 *         name: evento_id
 *         required: true
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [confirmados, pendentes]
 *         description: Filtra apenas confirmados ou apenas pendentes (Opcional)
 *     responses:
 *       200:
 *         description: Retorna array ordenado de Convidados com seus Acompanhantes Embutidos
 */
// GET /api/eventos/:evento_id/convidados
router.get('/', catchAsync(convidadoController.index));

/**
 * @swagger
 * /api/eventos/{evento_id}/convidados/{id}/confirmar:
 *   put:
 *     summary: Modifica confirmação de presença (calculando limites e restrições da lista).
 *     tags: [Convidados]
 *     parameters:
 *       - in: path
 *         name: evento_id
 *         required: true
 *       - in: path
 *         name: id
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               confirmado:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Presença confirmada
 *       400:
 *         description: Não há vagas suficientes na lista do evento. 
 */
// PUT /api/eventos/:evento_id/convidados/:id/confirmar
router.put('/:id/confirmar', validateConfirmacao, catchAsync(convidadoController.confirmar));

/**
 * @swagger
 * /api/eventos/{evento_id}/convidados/{id}:
 *   put:
 *     summary: Atualiza os dados básicos do convidado (nome e telefone).
 *     tags: [Convidados]
 *     parameters:
 *       - in: path
 *         name: evento_id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               telefone:
 *                 type: string
 *                 example: (11) 99999-9999
 *     responses:
 *       200:
 *         description: Convidado atualizado com sucesso
 */
// PUT /api/eventos/:evento_id/convidados/:id
router.put('/:id', validateConvidado, catchAsync(convidadoController.update));

/**
 * @swagger
 * /api/eventos/{evento_id}/convidados/{id}:
 *   delete:
 *     summary: Exclui o convidado por completo e sua árvore de acompanhantes.
 *     tags: [Convidados]
 *     parameters:
 *       - in: path
 *         name: evento_id
 *         required: true
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Excluído com sucesso
 */
// DELETE /api/eventos/:evento_id/convidados/:id
router.delete('/:id', catchAsync(convidadoController.delete));

/**
 * @swagger
 * /api/eventos/{evento_id}/convidados/{id}/acompanhantes:
 *   post:
 *     summary: Adiciona um acompanhante a um convidado específico.
 *     tags: [Convidados]
 *     parameters:
 *       - in: path
 *         name: evento_id
 *         required: true
 *       - in: path
 *         name: id
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *     responses:
 *       201:
 *         description: Acompanhante adicionado com sucesso
 */
router.post('/:id/acompanhantes', catchAsync(convidadoController.addAcompanhante));

/**
 * @swagger
 * /api/eventos/{evento_id}/convidados/{id}/acompanhantes/{acomp_id}:
 *   put:
 *     summary: Atualiza o nome de um acompanhante.
 *     tags: [Convidados]
 *     parameters:
 *       - in: path
 *         name: evento_id
 *         required: true
 *       - in: path
 *         name: id
 *         required: true
 *       - in: path
 *         name: acomp_id
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *     responses:
 *       200:
 *         description: Acompanhante atualizado com sucesso
 */
router.put('/:id/acompanhantes/:acomp_id', catchAsync(convidadoController.updateAcompanhante));

/**
 * @swagger
 * /api/eventos/{evento_id}/convidados/{id}/acompanhantes/{acomp_id}:
 *   delete:
 *     summary: Remove um acompanhante de um convidado.
 *     tags: [Convidados]
 *     parameters:
 *       - in: path
 *         name: evento_id
 *         required: true
 *       - in: path
 *         name: id
 *         required: true
 *       - in: path
 *         name: acomp_id
 *         required: true
 *     responses:
 *       200:
 *         description: Acompanhante removido com sucesso
 */
router.delete('/:id/acompanhantes/:acomp_id', catchAsync(convidadoController.deleteAcompanhante));

module.exports = router;
