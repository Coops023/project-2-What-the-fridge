
const express = require('express');
const router = express.Router();
const User = require('../models/User.model')
const bcrypt = require('bcrypt');
const saltRound = 10;

//Sign up page get
router.get('/signup', (req, res) => {
    res.render('signup');
});

//sign up page new loggin create
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
                .then((user) => res.render('login', { user }))
                .catch((error) => res.render('signup', { errorMessage: error }));
        })
        .catch((error) => next(error));
});

//log in page get/render
router.get('/login', (req, res, next) => {
    res.render('login');
});

//login to user account
router.post('/login', (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.render('login', {
            errorMessage: 'Username and password are requiered'
        });
    }

    User.findOne({ username }).then((user) => {
        if (!user) {
            res.render('login', { errorMessage: 'Incorrect user or password' });
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

//logout of user account
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) res.redirect('/');
        else res.redirect('/auth/login');
    });
});

module.exports = router