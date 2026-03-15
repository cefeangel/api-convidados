const express = require('express');
const router = express.Router();

// Basic health check route
router.get('/health', (req, res) => {
  res.json({ message: 'API is running successfully!' });
});

module.exports = router;
