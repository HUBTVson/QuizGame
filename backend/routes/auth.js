const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// When a POST request '/register', run the registration function
router.post('/register', authController.registerUser);

module.exports = router;