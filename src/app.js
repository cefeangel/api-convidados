const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const eventoRoutes = require('./routes/eventoRoutes');
const setupSwagger = require('./config/swagger');

const errorHandler = require('./middlewares/errorHandler');

// Apply Swagger UI config
setupSwagger(app);

// Basic health check route
app.get('/health', (req, res) => {
  res.json({ message: 'API is running successfully!' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/eventos', eventoRoutes);

// Central Error Handler (must be the last middleware)
app.use(errorHandler);

module.exports = app;
