const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  res.send('Sistem Informasi Pengadaan Barang — Kelompok B09');
});

router.get('/dashboard', async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) {
      return res.send('Silakan login terlebih dahulu');
    }
    const [rows] = await db.query(
      `SELECT u.name, r.name as role 
       FROM users u
       LEFT JOIN model_has_roles mhr ON u.id = mhr.model_id
       LEFT JOIN roles r ON mhr.role_id = r.id
       WHERE u.id = ?`,
      [userId]
    );
    const user = rows[0] || { name: 'Pengguna', role: 'Admin' };

    res.render('dashboard', {
      role: user.role || 'Admin',
      nama: user.name,
    });
  } catch (error) {
    console.error('DB error:', error);
    // Fallback ke data statis saat database error
    res.render('dashboard', {
      role: 'Admin',
      nama: 'Test User (DB Error)',
    });
  }
});

module.exports = router;

