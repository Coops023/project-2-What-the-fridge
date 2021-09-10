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

router.get('/fridge/add', isLoggedIn,(req,res) => {
    ingredients = req.query.ingredients.split(',');
    User.findByIdAndUpdate(req.session.currentUser._id, {$push: { ingredients: ingredients }})
    .then(data => {
        console.log(data)
    })
    .catch(err => console.log(err))
})


module.exports = router;
