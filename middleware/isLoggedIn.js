function isLoggedIn(req, res, next) {
<<<<<<< HEAD
    if (req.session.currentUser) {
        next();
    } else {
        res.redirect('/auth/login');
    }
=======
	if (req.session.currentUser) {
		next();
	} else {
		res.redirect('/auth/login');
	}
>>>>>>> 01859d42c10834c2d9d36f65cd398936ba9fddbe
}

module.exports = isLoggedIn;
