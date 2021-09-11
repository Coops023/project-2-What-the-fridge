const express = require('express');
const router = express.Router();
const Recipes = require('../models/Recipe.model');
const User = require('../models/User.model');

function isLoggedIn(req, res, next) {
    if (req.session.currentUser) next() // next invocation tells Express that the middleware has done all it work
    else res.redirect("/auth/login")
}

router.get("/profile", isLoggedIn, (req, res) => {
    const userId = req.session.currentUser._id
    User.findById(userId)
        .populate('recipes')
        .then(userData => res.render("user-profile", { user: userData }))
})

router.get("/", isLoggedIn, (req, res) => {
    res.render("private")
})

router.post('/fridge/add', isLoggedIn, (req, res) => {
    ingredients = req.body.ingredients.split(',');
    User.findByIdAndUpdate(req.session.currentUser._id, { $push: { ingredients: ingredients } })
        .then(data => {
            res.render('fridge', { ingredients: data.ingredients });
        })

        .catch(err => console.log(err))
})


router.get('/fridge', isLoggedIn, (req, res) => {
    const user = req.session.currentUser
    console.log("USER:", user)
    User.findById(req.session.currentUser._id)
        .then(userData => {
            res.render('fridge', { ingredients: userData.ingredients });
            window.reload()
        })

})

router.get('/fridge/remove/recipe/:id', (req, res) => {
    User.updateOne(
        { _id: req.session.currentUser._id },
        { $pullAll: { recipes: [{ _id: req.params.id }] } },
        { new: true }
    )
        .then(() => res.redirect('/private/profile'))
        .catch(err => console.log(err))
})

router.route("/edit/:id")
    .get((req, res) => {
        User.findById({ _id: req.session.currentUser._id })
            .then(user => res.render("edit-user", user))

    })
    .post((req, res) => {
        const {
            username,
            password,
            email,
            recipes,
            ingredients
        } = req.body
        User.findByIdAndUpdate(req.session.currentUser._id, {
            username,
            password,
            email,
            recipes,
            ingredients
        }
        )
            .then(updateUser => res.redirect(`profile`))
            .catch(error => console.log(error))
    })








module.exports = router;
