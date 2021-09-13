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



router.get("/profile", isLoggedIn, (req, res) => {
    const userId = req.session.currentUser._id;
    User.findById(userId)
        .populate('recipes')
        .then(user => res.render("user-profile", { user }));
});



router.post('/fridge/add', isLoggedIn, (req, res) => {
    const { ingredient } = req.body

    User.findByIdAndUpdate(req.session.currentUser._id, { $addToSet: { ingredients: ingredient } })
        .then(user => {
            res.redirect(`/private/fridge`)
        })

        .catch(err => console.log(err));
});

// router.get("/fridge/compare/recipe/:id", isLoggedIn, (req, res) => {
//     const userId = req.session.currentUser._id;
//     const recipeId =
//         User.findById(userId)
//             .populate('recipes')
//             .then(userData => res.render("recipe-detail", { user: userData }));
// });


router.get('/fridge/compare/recipe/:id', (req, res) => {
    console.log("THIS IS THE ID", req.params.id)
    Recipes.findById(req.params.id)
        .then((recipe) => {
            User.findById(req.session.currentUser._id)
                .then(user => {
                    //compare logic
                    for (let index in recipe.ingredients) {
                        if (!user.ingredients.includes(recipe.ingredients[index].name)) {
                            recipe.ingredients[index].isMissing = true
                            recipe.missingIngredients += 1

                        }
                    }



                    console.log("here is the recipe:", recipe)

                    res.render('recipe-detail', { recipe: recipe, user: user })
                })
        })
        .catch((error) => {
            console.log(error);
        });

});



router.get('/fridge', isLoggedIn, (req, res) => {
    User.findById(req.session.currentUser._id)
        .then(userData => {
            res.render('fridge', { ingredients: userData.ingredients });

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


router.route("/edit/:id")
    .get((req, res) => {
        User.findById({ _id: req.session.currentUser._id })
            .then(user => res.render("edit-user", user))
            .catch(err => console.log(err));
    })
    .post((req, res) => {

        const { username, password, email } = req.body

        const salt = bcrypt.genSaltSync(saltRound);
        const hashPassword = bcrypt.hashSync(password, salt);
        if (!password) {

            User.findByIdAndUpdate(req.session.currentUser._id, {
                username: username,
                email: email

            })
                .then(() => res.redirect(`/private/profile`))
                .catch(error => console.log(error));
        }
        else {
            User.findByIdAndUpdate(req.session.currentUser._id, {
                username: username,
                password: hashPassword,
                email: email

            })
                .then(() => res.redirect(`/private/profile`))
                .catch(error => console.log(error));
        }

    });



// remember RENDER = PAGE | REDIRECT = URL  -! (/) !-
// Maybe think of them as pairs/brothers
// brother1 renders what we see
// brother2 maps where we go - / -


module.exports = router;
