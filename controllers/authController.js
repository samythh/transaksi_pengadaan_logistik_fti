const db = require('../db');
const bcrypt = require('bcrypt');

// Menampilkan halaman login (render EJS, tanpa layout)
exports.getLogin = (req, res) => {
    res.render('login', {
        layout: false,
        error: req.query.error || null,
    });
};

// Memproses verifikasi kredensial berdasarkan email dan password
exports.postLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Melakukan kueri JOIN untuk mengambil data user sekaligus role yang dimiliki
        const query = `
            SELECT users.*, roles.name AS role_name
            FROM users
            JOIN model_has_roles ON users.id = model_has_roles.model_id
            JOIN roles ON model_has_roles.role_id = roles.id
            WHERE users.email = ?
        `;

        const [rows] = await db.query(query, [email]);
        console.log('[LOGIN] email:', email, '| rows found:', rows.length);

        if (rows.length > 0) {
            const user = rows[0];
            const isMatch = await bcrypt.compare(password, user.password);
            console.log('[LOGIN] password match:', isMatch);

            if (isMatch) {
                // Menyimpan identitas dan role ke dalam session
                req.session.user = {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role_name // Role hasil JOIN (Admin atau Wakil Dekan)
                };

                return res.redirect('/dashboard');
            }
        }

        // Redirect kembali ke login jika verifikasi gagal
        res.redirect('/login?error=Kredensial tidak valid');
    } catch (error) {
        console.error('Database Error:', error);
        res.status(500).send('Terjadi kesalahan pada sistem database.');
    }
};

// Mengakhiri sesi pengguna
exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/dashboard');
        }
        res.clearCookie('connect.sid');
        res.redirect('/login');
    });
};
