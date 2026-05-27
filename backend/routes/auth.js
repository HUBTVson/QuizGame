const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// When a POST request '/register', run the registration function
router.post('/register', authController.registerUser);

// When a POST request '/login', run the login function
router.post('/login', authController.loginUser);

// DELETE http://localhost:5000/api/auth/:id
router.delete('/:id', authController.deleteUser);

module.exports = router;