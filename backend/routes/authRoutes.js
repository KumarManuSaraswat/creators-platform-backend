const express = require('express');
const { loginUser } = require('../controllers/authController');

const router = express.Router();

// Auth status route
router.get('/', (req, res) => {
  res.json({ message: 'Auth API is working' });
});

// Login route
router.post('/login', loginUser);

module.exports = router;