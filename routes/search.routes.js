const axios = require('axios');
const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe.model');
const User = require('../models/User.model');

router.get('/ingredients', (req,res) => {
    res.render('search-recipes');
});

router.post('/ingredients', (req,res) => {
    const { ingredients } = req.body
    concatIngredients = ingredients.split(',').reduce((prev, curr) => {
    return prev + ',+' + curr;
    })
    axios({
        method: 'get',
        url: `https://api.spoonacular.com/recipes/findByIngredients?apiKey=60dcb55702f14e43ab172bf6ff6ac5a4&ingredients=${concatIngredients}&ranking=2&ignorePantry=true`
    })
    .then(data => res.render('search-results', {data: data.data}))
    .catch(err => console.log(err));
})

router.get('/save/recipe/:id', (req,res) => {
    axios({
        method: 'get',
        url: `https://api.spoonacular.com/recipes/${req.params.id}/information?apiKey=60dcb55702f14e43ab172bf6ff6ac5a4&includeNutrition=false`
    })
    .then(data => {
        const allIngredients = []
        for(let ingredient in data.data.extendedIngredients) {
            allIngredients.push(data.data.extendedIngredients[ingredient].name);
        };
        Recipe.create({ apidDBId: req.params.id,image: data.data.image, title: data.data.title ,ingredients: allIngredients})
        .then(recipe => 
            User.findByIdAndUpdate(req.session.currentUser._id, {$addToSet: { recipes: recipe._id }})
            .then(() => console.log('recipe saved to user!'))
            .catch(err => console.log(err))
        )
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
})

module.exports = router;