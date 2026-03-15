const { body } = require('express-validator');

const validateLogin = [
  body('email')
    .notEmpty()
    .withMessage('O e-mail é obrigatório')
    .isEmail()
    .withMessage('E-mail com formato inválido'),
  
  body('senha')
    .notEmpty()
    .withMessage('A senha é obrigatória')
];

module.exports = {
  validateLogin
};
