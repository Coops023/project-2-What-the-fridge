const express = require('express');
const User = require('../models/User.model');
const router = express.Router();
const saltRound = 10;
const bcrypt = require('bcrypt');

router.get('/signup', (req, res, next) => {
    res.render('pages/signup');
});

router.post('/signup', (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.render('pages/signup', {
            errorMessage: 'Username and password are requiered'
        });
    }
    //add loggin home route
    User.findOne({ email })
        .then((user) => {
            if (user) {
                res.render('/', { errorMessage: 'User already exists' });
            }

            const salt = bcrypt.genSaltSync(saltRound);
            const hashPassword = bcrypt.hashSync(password, salt);

            User.create({ email, password: hashPassword })
                .then(() => res.render('index'))
                .catch((error) => res.render('index', { errorMessage: error }));
        })
        .catch((error) => next(error));
});

router.get('/login', (req, res, next) => {
    res.render('login');
});

router.post('/login', (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.render('login', {
            errorMessage: 'Username and password are requiered'
        });
    }

    User.findOne({ email }).then((user) => {
        if (!user) {
            res.render('login', { errorMessage: 'Incorrect email or password' });
        }
        const passwordCorrect = bcrypt.compareSync(password, user.password);
        if (passwordCorrect) {
            req.session.currentUser = user;
            res.redirect('/private/profile');
        } else {
            res.render('login', { errorMessage: 'Incorrect email or password' });
        }
    });
});

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) res.redirect('/');
        else res.redirect('/auth/login');
    });
});

module.exports = router;

