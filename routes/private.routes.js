const express = require('express');
const router = express.Router();
const Recipes = require('../models/Recipe.model');
const User = require('../models/User.model');
const bcrypt = require('bcrypt');
const saltRound = 10;

function isLoggedIn(req, res, next) {
    if (req.session.currentUser) next() // next invocation tells Express that the middleware has done all it work
    else res.redirect("/auth/login");
};
// -- private page was removed so this is dead code -- 
// router.get("/", isLoggedIn, (req, res) => {
//     res.render("private");
// });




router.get("/profile", isLoggedIn, (req, res) => {
    const userId = req.session.currentUser._id;
    User.findById(userId)
        .populate('recipes')
        .then(userData => res.render("user-profile", { user: userData }));
});


router.post('/fridge/add', isLoggedIn, (req, res) => {
    ingredients = req.body.ingredients.split(',');
    // I still struggle a lot with this. I think you are pushing the whole array into one array element
    // Try looking up adding an array into an array of a mongoose model. It seems very anal about syntax
    // and requirements. You might have to make a function that loops through and adds each element
    User.findByIdAndUpdate(req.session.currentUser._id, { $push: { ingredients: ingredients } })
        .then(user => {
            res.render('fridge', { ingredients: user.ingredients });
        })
        .catch(err => console.log(err));
});

router.get('/fridge', isLoggedIn, (req, res) => {
    User.findById(req.session.currentUser._id)
        .then(userData => {
            res.render('fridge', { ingredients: userData.ingredients });
            window.reload();
        })
        .catch(err => console.log(err));
});


router.get('/fridge/remove/recipe/:id', (req, res) => {
    User.updateOne(
        { _id: req.session.currentUser._id },
        { $pullAll: { recipes: [{ _id: req.params.id }] } },
        { new: true }
    )
        .then(() => res.redirect('/private/profile'))
        .catch(err => console.log(err));
});

// remember you need to encrypt the password before saving it to the database!
// here you are trying to save the new password without encryption. 
// look at the signup routes in auth.routes that uses bcrypt
// updating a model is a pain in the ass. I think we have to use special syntax
router.route("/edit/:id")
    .get((req, res) => {
        User.findById({ _id: req.session.currentUser._id })
            .then(user => res.render("edit-user", user))
            .catch(err => console.log(err));
    })
    .post((req, res) => {
        const {
            username,
            password,
            email,
            recipes,
            ingredients
        } = req.body
        const salt = bcrypt.genSaltSync(saltRound);
        const hashPassword = bcrypt.hashSync(password, salt);
        User.findByIdAndUpdate(req.session.currentUser._id, {
            username,
            password: hashPassword,
            email,
            recipes,
            ingredients
        }
        )
            .then(() => res.redirect(`profile`))
            .catch(error => console.log(error));
    });

// remember RENDER = PAGE | REDIRECT = URL  -! (/) !-
// Maybe think of them as pairs/brothers
// brother1 renders what we see
// brother2 maps where we go - / -


module.exports = router;
