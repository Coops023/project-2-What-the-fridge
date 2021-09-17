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
    let userId = req.session.currentUser._id
    User.findById(userId)
        .then((user) => {
            console.log("USER INGREDIENTS", user.ingredients)
            res.render('search-recipes', { user: user })
        })
        .catch((err) => {
            console.log(err)
        })
})


router.post('/ingredients', (req, res) => {
    const { ingredients } = req.body
    console.log("line 25", ingredients)
    let concatIngredients

    if (ingredients.includes('') && Array.isArray(ingredients)) {
        concatIngredients = ingredients.reduce((prev, curr) => { return prev + ',+' + curr })
    }
    else if (typeof ingredients === "string") {
        concatIngredients = ingredients.split(',').reduce((prev, curr) => { return prev + ',+' + curr })//.join(",+")
    }

    axios({
        method: 'get',
        url: `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${process.env.API_KEY}&ingredients=${concatIngredients}&ranking=2&ignorePantry=true`
    })
        .then(response => {
            console.log('line 32', req.session.currentUser)
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

router.post('/fridge/recipe/save', async (req, res) => {
    const user = await User.findById(req.session.currentUser._id)
    const newRecipe = { title: '', image: '', ingredients: [], instructions: [], missingIngredients: 0 };

    const recipeInfoResponse = await axios.get(`https://api.spoonacular.com/recipes/${req.body.id}/information?apiKey=${process.env.API_KEY}&includeNutrition=false`);
    const { extendedIngredients } = recipeInfoResponse.data;

    const arrayOfMgsIngredients = await extendedIngredients.map(async (ingredient) => {
        const user = await User.findById(req.session.currentUser._id)
        const userHas = user.ingredients.includes(ingredient.name)
        const ingredients = await Ingredient.create({ name: ingredient.name, image: ingredient.image, userMissing: userHas })
        return newRecipe.ingredients.push(ingredients._id);
    })

    // for(const ingredient of extendedIngredients) {
    //     const userHas = user.ingredients.includes(ingredient.name)
    //     const ingredient = await Ingredient.create({name: ingredient.name, image: ingredient.image, userMissing: userHas})
    //     newRecipe.ingredients.push(ingredient._id);
    // }

    const recipeInstructionsResponse = await axios.get(`https://api.spoonacular.com/recipes/${req.body.id}/analyzedInstructions?apiKey=${process.env.API_KEY}`)
    const { steps } = recipeInstructionsResponse.data[0]

    newRecipe.instructions = steps.map((nextStep) => nextStep.step)
    newRecipe.title = recipeInfoResponse.data.title;
    newRecipe.image = recipeInfoResponse.data.image;

    Recipe.create({ apidDBId: req.body.id, title: newRecipe.title, image: newRecipe.image, ingredients: newRecipe.ingredients, instructions: newRecipe.instructions, missingIngredients: newRecipe.missingIngredients })
        .then(recipe => {
            User.findByIdAndUpdate(req.session.currentUser._id, { $addToSet: { recipes: recipe._id } })
                .then(() => console.log('new recipe added: ', recipe))
                .catch(err => console.log(err));
        })

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