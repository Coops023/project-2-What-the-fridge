function isNotLoggedIn(req, res, next) {
<<<<<<< HEAD
<<<<<<< HEAD
    if (req.session.currentUser) {
        res.redirect('/private/profile');
    } else {
        next();
    }
=======
=======
>>>>>>> ba1af9504f9b9b41999d6bdabfaa757d2d6ba153
	if (req.session.currentUser) {
		res.redirect('/private/profile');
	} else {
		next();
	}
<<<<<<< HEAD
>>>>>>> 01859d42c10834c2d9d36f65cd398936ba9fddbe
=======
>>>>>>> ba1af9504f9b9b41999d6bdabfaa757d2d6ba153
}

module.exports = isNotLoggedIn;
