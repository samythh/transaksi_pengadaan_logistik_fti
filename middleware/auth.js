module.exports = {
    // Memastikan pengguna telah login sebelum mengakses halaman
    isLoggedIn: (req, res, next) => {
        if (req.session.user) {
            return next();
        }
        res.redirect('/login');
    },

    // membatasi akses berdasarkan role (Admin / Wakil Dekan)
    checkRole: (role) => {
        return (req, res, next) => {
            if (req.session.user && req.session.user.role === role) {
                return next();
            }
            res.status(403).render('403', {
                nama: req.session.user ? req.session.user.name : 'User',
                role: req.session.user ? req.session.user.role : null,
            });
        };
    }
};
