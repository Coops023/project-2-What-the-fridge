const axios = require('axios');
const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe.model');
const User = require('../models/User.model');

router.get('/ingredients', (req,res) => {
    res.render('search-recipes');
});

router.post('/ingredients', (req,res) => {
    const { searchBy, ingredients } = req.body

    switch(searchBy){
        case "ingredient":
        // We build te correct string for the api    
        break;
        case "name":
            break;
        default:
            break;
    }

    concatIngredients = ingredients.split(',').reduce((prev, curr) => {
    return prev + ',+' + curr;
    })
    axios({
        method: 'get',
        url: `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${process.env.API_KEY}&ingredients=${concatIngredients}&ranking=2&ignorePantry=true`
    })
    .then(response => res.render('search-results', {data: response.data}))
    .catch(err => console.log(err));
})

router.get('/save/recipe/:id', (req,res) => {
    axios({
        method: 'get',
        url: `https://api.spoonacular.com/recipes/${req.params.id}/information?apiKey=${process.env.API_KEY}&includeNutrition=false`
    })
    .then(data => {
        const allIngredients = data.data.extendedIngredients.map((el)=>el.name)
        const allIngredients2 = []
        for(let ingredient in data.data.extendedIngredients) {
            allIngredients2.push(data.data.extendedIngredients[ingredient].name);
        };

        console.log(allIngredients)
        console.log(allIngredients2)

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

router.get('/fridge', (req,res) => {
    res.render('fridge');
})


module.exports = router;