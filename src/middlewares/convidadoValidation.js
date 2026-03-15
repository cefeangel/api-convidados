const { body, param } = require('express-validator');

// Validation Regex for Brazilian Phones
const phoneRegex = /^\(?\d{2}\)?\s?9?\d{4}-?\d{4}$/;

const validateConvidado = [
  param('evento_id')
    .isInt()
    .withMessage('ID do evento inválido.'),

  body('nome')
    .notEmpty()
    .withMessage('O nome do convidado é obrigatório.')
    .isLength({ min: 3 })
    .withMessage('O nome deve ter no mínimo 3 caracteres.'),

  body('telefone')
    .notEmpty()
    .withMessage('O número de telefone é obrigatório.')
    .matches(phoneRegex)
    .withMessage('Formato de telefone inválido. Tente (XX) 9XXXX-XXXX.'),

  body('confirmado')
    .optional()
    .isBoolean()
    .withMessage('O status de confirmação deve ser verdadeiro ou falso.'),

  body('acompanhantes')
    .optional()
    .isArray()
    .withMessage('Os acompanhantes devem ser enviados em formato de lista (Array).'),

  body('acompanhantes.*.nome')
    .if(body('acompanhantes').exists())
    .notEmpty()
    .withMessage('O nome de cada acompanhante é obrigatório.')
];

const validateConfirmacao = [
  param('evento_id').isInt().withMessage('ID do evento inválido.'),
  param('id').isInt().withMessage('ID do convidado inválido.'),
  body('confirmado')
    .isBoolean()
    .withMessage('O status de confirmado é obrigatório (true/false).')
];

module.exports = {
  validateConvidado,
  validateConfirmacao
};
