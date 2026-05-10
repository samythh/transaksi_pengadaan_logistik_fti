const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Sistem Informasi Pengadaan Barang — Kelompok B09');
});

module.exports = router;
