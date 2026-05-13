const express = require('express');
const router = express.Router();
const { isLoggedIn, checkRole } = require('../middleware/auth');

router.get('/', (req, res) => {
  if (req.session.user) {
    return res.redirect('/dashboard');
  }
  res.redirect('/login');
});

// Hanya user yang sudah login yang bisa akses dashboard
router.get('/dashboard', isLoggedIn, (req, res) => {
  res.render('dashboard', {
    nama: req.session.user.name,
    role: req.session.user.role,
  });
});

// hanya Admin yang boleh akses Purchase Order
router.get('/po', isLoggedIn, checkRole('Admin'), (req, res) => {
  res.send('Modul Purchase Order, akses ACL berhasil.');
});

// hanya Admin yang boleh akses Stok
router.get('/stok', isLoggedIn, checkRole('Admin'), (req, res) => {
  res.send('Modul Stok, akses ACL berhasil.');
});

module.exports = router;
