const { Schema, model } = require('mongoose');

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const ingredientSchema = new Schema({

    name: String,
    image: String,
    userMissing: false 
});

const Ingredient = model('Ingredient', ingredientSchema);

module.exports = Ingredient;