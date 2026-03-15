const { body } = require('express-validator');

const validateUserRegistration = [
  body('nome')
    .notEmpty()
    .withMessage('O nome é obrigatório')
    .isLength({ min: 3 })
    .withMessage('O nome deve ter no mínimo 3 caracteres'),
  
  body('email')
    .notEmpty()
    .withMessage('O e-mail é obrigatório')
    .isEmail()
    .withMessage('E-mail com formato inválido'),
  
  body('senha')
    .notEmpty()
    .withMessage('A senha é obrigatória')
    .isLength({ min: 6 })
    .withMessage('A senha deve ter no mínimo 6 caracteres')
];

const validateUserUpdate = [
  body('nome')
    .optional()
    .isLength({ min: 3 })
    .withMessage('O nome deve ter no mínimo 3 caracteres'),
  
  body('email')
    .optional()
    .isEmail()
    .withMessage('E-mail com formato inválido'),
  
  body('senha')
    .optional()
    .isLength({ min: 6 })
    .withMessage('A senha deve ter no mínimo 6 caracteres')
];

module.exports = {
  validateUserRegistration,
  validateUserUpdate
};
