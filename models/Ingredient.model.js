const { Schema, model } = require('mongoose');

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const ingredientSchema = new Schema({

    api_id: String,
    name: String,
    image: String
});

const Ingredient = model('Ingredient', ingredientSchema);

module.exports = Ingredient;