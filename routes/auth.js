const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Jalur untuk menampilkan halaman login.
router.get('/login', authController.getLogin);

// Jalur untuk memproses data dari formulir login. 
router.post('/login', authController.postLogin);

// Jalur untuk menghapus sesi pengguna (Logout). 
router.get('/logout', authController.logout);

module.exports = router;