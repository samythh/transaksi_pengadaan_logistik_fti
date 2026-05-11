module.exports = {
    // Memastikan pengguna telah login sebelum mengakses halaman
    isLoggedIn: (req, res, next) => {
        if (req.session.user) {
            return next();
        }
        res.redirect('/login');
    },

    // Implementasi ACL untuk membatasi akses berdasarkan role (Admin/Wakil Dekan)
    checkRole: (role) => {
        return (req, res, next) => {
            if (req.session.user && req.session.user.role === role) {
                return next();
            }
            // Memberikan respon status 403 jika role tidak sesuai dengan syarat akses
            res.status(403).send('Forbidden: Anda tidak memiliki akses untuk fitur ini.');
        };
    }
};