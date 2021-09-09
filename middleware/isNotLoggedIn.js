function isNotLoggedIn(req, res, next) {
<<<<<<< HEAD
    if (req.session.currentUser) {
        res.redirect('/private/profile');
    } else {
        next();
    }
=======
	if (req.session.currentUser) {
		res.redirect('/private/profile');
	} else {
		next();
	}
>>>>>>> 01859d42c10834c2d9d36f65cd398936ba9fddbe
}

module.exports = isNotLoggedIn;
