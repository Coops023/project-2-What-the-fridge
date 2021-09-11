const axios = require('axios');
const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe.model');
const User = require('../models/User.model');

function isSaved(user, recipes) {
let recipeResultsIndex = 0
for(let uRecipe in user.recipes) {
    if(uRecipe.title === recipes[recipeResultsIndex].title) return true
    recipeResultsIndex++
}
return false
}

router.get('/ingredients', (req,res) => {
    res.render('search-recipes', {user: req.session.currentUser});
});

router.post('/ingredients', (req,res) => {
    const { ingredients } = req.body
    concatIngredients = ingredients.split(',').reduce((prev, curr) => { return prev + ',+' + curr });
    axios({
        method: 'get',
        url: `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${process.env.API_KEY}&ingredients=${concatIngredients}&ranking=2&ignorePantry=true`
    })
    .then(response => {
        User.findById(req.session.id)
        .populate('recipes')
        .then(user => {
            res.render('search-results', { recipes: response.data, user: user.recipes })
        })
        .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
})

router.post('/fridge/recipe/save', (req,res) => {
    console.log('line 23:', req.body)
    const recipe = {title: '', image: '', ingredients: [], instructions: []};
    axios({
        method: 'get',
        url: `https://api.spoonacular.com/recipes/${req.body.id}/information?apiKey=${process.env.API_KEY}&includeNutrition=false`
    })
    .then(response => {
        const allIngredients = response.data.extendedIngredients.map((ingredient)=>ingredient.name)
        recipe.title = response.data.title;
        recipe.image = response.data.image;
        recipe.ingredients = allIngredients; 
    })
    .then(() => {
        axios({
            method: 'get',
            url: `https://api.spoonacular.com/recipes/${req.body.id}/analyzedInstructions?apiKey=${process.env.API_KEY}`
        })
        .then(response => {
            // data is returned as an array of 1
            recipe.instructions = response.data[0].steps.map((nextStep) => nextStep.step);
            Recipe.create({apidDBId: req.body.id, title: recipe.title, image: recipe.image, ingredients: recipe.ingredients, instructions: recipe.instructions})
            .then(recipe => 
                User.findByIdAndUpdate(req.session.currentUser._id, {$addToSet: { recipes: recipe._id }})
                .then(() => console.log('new recipe added: ', recipe))
                .catch(err => console.log(err))
            )
            .catch(err => console.log(err));
        })
        .catch((err) => console.log(err))
    })
    .catch(err => console.log(err))
})

module.exports = router;
