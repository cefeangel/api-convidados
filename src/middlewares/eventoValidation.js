const { body } = require('express-validator');

const validateEvento = [
  body('nome')
    .notEmpty()
    .withMessage('O nome da lista é obrigatório.')
    .isLength({ min: 3 })
    .withMessage('O nome deve ter no mínimo 3 caracteres.'),
    
  body('maximo_convidados')
    .notEmpty()
    .withMessage('O limite máximo de convidados é obrigatório.')
    .isInt({ min: 1 })
    .withMessage('A quantidade máxima de convidados deve ser um número inteiro maior que zero.'),

  body('maximo_acompanhantes_por_convidado')
    .optional()
    .isInt({ min: 0 })
    .withMessage('A quantidade máxima de acompanhantes deve ser um número inteiro igual ou maior que zero.')
];

const validateEventoUpdate = [
  body('nome')
    .optional()
    .isLength({ min: 3 })
    .withMessage('O nome deve ter no mínimo 3 caracteres.'),
    
  body('maximo_convidados')
    .optional()
    .isInt({ min: 1 })
    .withMessage('A quantidade máxima de convidados deve ser um número inteiro maior que zero.'),

  body('maximo_acompanhantes_por_convidado')
    .optional()
    .isInt({ min: 0 })
    .withMessage('A quantidade máxima de acompanhantes deve ser um número inteiro igual ou maior que zero.')
];

module.exports = {
  validateEvento,
  validateEventoUpdate
};
