const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST http://localhost:5000/api/auth/register
router.post('/register', authController.registerUser);

// POST http://localhost:5000/api/auth/login
router.post('/login', authController.loginUser);

// DELETE http://localhost:5000/api/auth/:id
router.delete('/:id', authController.deleteUser);

module.exports = router;