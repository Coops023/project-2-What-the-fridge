const axios = require('axios');
const express = require('express');
const Ingredient = require('../models/Ingredient.model');
const router = express.Router();
const Recipe = require('../models/Recipe.model');
const User = require('../models/User.model');

// ignore for now
function isSaved(user, recipes) {
    let recipeResultsIndex = 0
    for (let uRecipe in user.recipes) {
        if (uRecipe.title === recipes[recipeResultsIndex].title) return true
        recipeResultsIndex++
    }
    return false
}

// -- SEARCH BY INGREDIENTS ROUTES --
router.get('/ingredients', (req, res) => {
    res.render('search-recipes', { user: req.session.currentUser });
});

router.post('/ingredients', (req, res) => {
    const { ingredients } = req.body
    concatIngredients = ingredients.split(',').reduce((prev, curr) => { return prev + ',+' + curr });//.join(",+")
    axios({
        method: 'get',
        url: `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${process.env.API_KEY}&ingredients=${concatIngredients}&ranking=2&ignorePantry=true`
    })
        .then(response => {
            User.findById(req.session.currentUser._id)
                .populate('recipes')
                .then(user => {
                    res.render('search-results', { recipes: response.data, user: user.recipes })
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
})

// -- SAVE NEW RECIPE TO USER ROUTES --

router.post('/fridge/recipe/save', (req, res) => {
    const newRecipe = { title: '', image: '', ingredients: [], instructions: [] };
    axios({
        method: 'get',
        url: `https://api.spoonacular.com/recipes/${req.body.id}/information?apiKey=${process.env.API_KEY}&includeNutrition=false`
    })
        .then(response1 => {

            const allIngredients = response1.data.extendedIngredients.map(ingredient => ({ name: ingredient.name, isMissing: false }))

            newRecipe.title = response1.data.title;
            newRecipe.image = response1.data.image;
            newRecipe.ingredients = allIngredients;

            axios({
                method: 'get',
                url: `https://api.spoonacular.com/recipes/${req.body.id}/analyzedInstructions?apiKey=${process.env.API_KEY}`
            })
                .then(response2 => {
                    // data is returned as an array of 1
                    newRecipe.instructions = response2.data[0].steps.map((nextStep) => nextStep.step);
                    Recipe.create({ apidDBId: req.body.id, title: newRecipe.title, image: newRecipe.image, ingredients: newRecipe.ingredients, instructions: newRecipe.instructions })
                        .then(recipe => {
                            User.findByIdAndUpdate(req.session.currentUser._id, { $addToSet: { recipes: recipe._id } })
                                .then(() => console.log('new recipe added: ', recipe))
                                .catch(err => console.log(err));
                        })
                        .catch(err => console.log(err));
                })
                .catch((err) => console.log(err));
        })
        .catch(err => console.log(err));
});

module.exports = router;


/**
 *  router.get("/someroute", (req, res)=>{
 * Receipe.create({...})
 * .then(newReceipe=>{
 *  spoonacularApi.get("...")
 * .then(spoonResponse=> {
 * newReceipe.title = spoonResponse.data.title
 * newReceipe.save().then(res.send("done"))
 * })
 *
 * 
 * router("/someAsyncRoute", async (req, res)=>{
 * 
 *  const spoonReceipe = await spoonacularApi.get("...")
 *  const {spoonIngredients} = spoonReceipe
 *  const arrayOfMgsIngredients = await spoonIngredients.map(async (ingredient)=> await Ingredient.create())
 *  
 *  const newReceipe = await Receipe.create({ingredients: arrayOfMgsIngredients})
 *  return res.render("receipe-template", {receipe: newReceipe})
 * })
 * 
 */