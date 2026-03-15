const AppError = require('../utils/AppError');

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Se o erro for do AppError (erro esperado)
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // Erros de programação ou do sistema (não mapeados pelo AppError)
  console.error('ERROR 💥:', err);

  return res.status(500).json({
    status: 'error',
    message: 'Algo deu errado no servidor',
  });
};

module.exports = errorHandler;
