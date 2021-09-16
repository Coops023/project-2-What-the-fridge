const express = require('express');
const router = express.Router();
const Recipes = require('../models/Recipe.model');
const User = require('../models/User.model');
const bcrypt = require('bcrypt');
const saltRound = 10;

//COMPARES INGREDIENTS IN FRIDGE TO INGREDIENTS NEEDED IN RECIPE
router.get('/fridge/compare/recipe/:id', (req, res) => {
    console.log("THIS IS THE ID", req.params.id)
    Recipes.findById(req.params.id)
        .populate('ingredients')
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
                    res.render('recipe-detail', { recipe: recipe, user: user })
                })
                .catch(err => console.log(err))
        })
        .catch((error) => {
            console.log(error);
        });
});


//ROUTE REMOVE ITEMS FROM USER INGREDIENTS ARRAY
router.get('/fridge/remove/recipe/:id', (req, res) => {
    User.updateOne(
        { _id: req.session.currentUser._id },
        { $pullAll: { recipes: [{ _id: req.params.id }] } },
        { new: true }
    )
        .then(() => res.redirect('/private/profile'))
        .catch(err => console.log(err));
});

//REMOVE ITEMS FROM FRIDGE
router.post('/fridge/remove', (req, res) => {
    let { ingredient } = req.body
    if (typeof ingredient === "undefined") ingredient = []
    if (typeof ingredient === "string") ingredient = [ingredient]
    User.findByIdAndUpdate(req.session.currentUser._id, { $pullAll: { ingredients: ingredient } })
        .then(() => {
            res.redirect(`/private/fridge`)
        })
        .catch(err => console.log(err));
});

//ADD ITEMS TO FRIDGE
router.post('/fridge/add', (req, res) => {
    const { ingredient } = req.body
    console.log(req.body.ingredient)
    User.findByIdAndUpdate(req.session.currentUser._id, { $addToSet: { ingredients: ingredient } })
        .then(user => {

            res.redirect(`/private/fridge`)
        })
        .catch(err => console.log(err));
});

router.post("/edit/delete", (req, res) => {
    console.log("LINE 68", req.session.currentUser._id)
    User.findByIdAndDelete(req.session.currentUser._id)
        .then(() => {
            res.redirect("/")
        })
})

//ROUTE TO EDIT LOGIN ACCOUNT DETAILS
router.route("/edit-profile")
    .get((req, res) => {
        User.findById({ _id: req.session.currentUser._id })
            .then(user => res.render("edit-user", user))
            .catch(err => console.log(err));
    })
    .post((req, res) => {

        const { username, email, password } = req.body

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
//LOAD RECIPE/PROFILE PAGE 
router.get("/profile", (req, res) => {
    const userId = req.session.currentUser._id;
    User.findById(userId)
        .populate({
            path: 'recipes',
            populate: {
                path: 'ingredients',
                model: 'Ingredient'
            }
        })
        .then(user => {
            userRecipes = user.recipes
            for (let indexRecipe in userRecipes) {
                for (let indexIngredient in userRecipes[indexRecipe].ingredients)
                    if (!user.ingredients.includes(userRecipes[indexRecipe].ingredients[indexIngredient].name)) {
                        userRecipes[indexRecipe].ingredients[indexIngredient].isMissing = true
                        userRecipes[indexRecipe].missingIngredients += 1
                    }
            }
            console.log('line 29', userRecipes);
            res.render("user-profile", { user })
        });
});

//FRIDGE PAGE GET ROUTE
router.get('/fridge', (req, res) => {
    User.findById(req.session.currentUser._id)
        .then(userData => {

            res.render('fridge', { ingredients: userData.ingredients });

        })
        .catch(err => console.log(err));
});

module.exports = router;
