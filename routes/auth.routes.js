
const express = require('express');
const router = express.Router();
const User = require('../models/User.model')
const saltRound = 10;

const bcrypt = require('bcrypt');

router.get('/signup', (req, res) => {
    res.render('signup');
});


router.post('/signup', (req, res, next) => {
    const { username, password, email } = req.body;
    if (!username || !password || !email) {
        res.render('signup', {
            errorMessage: 'Username and password are requiered'
        });
    }

    User.findOne({ username })
        .then((user) => {
            if (user) {
                res.render('signup', { errorMessage: 'User already exists' });
            }

            const salt = bcrypt.genSaltSync(saltRound);
            const hashPassword = bcrypt.hashSync(password, salt);

            User.create({ username, password: hashPassword, email })
                .then((user) => res.render('user-profile', { user }))
                .catch((error) => res.render('signup', { errorMessage: error }));
        })
        .catch((error) => next(error));
});

module.exports = router