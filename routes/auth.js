const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// halaman login
router.get('/login', authController.getLogin);

// proses data dari formulir login
router.post('/login', authController.postLogin);

// Logout
router.get('/logout', authController.logout);

module.exports = router;