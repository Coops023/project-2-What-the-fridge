const { Schema, model } = require('mongoose');

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const recipeSchema = new Schema({

    apiDBId: String,
    image: String,
    title: String,
    ingredients: [{
        type: Schema.Types.ObjectId, ref: 'Ingredient', default: []
    }],
    instructions: [String],
    missingIngredients: Number

    // favorites: [{ type: Schema.Types.ObjectId, ref: 'Room', default: [] }]
});

const Recipe = model('Recipe', recipeSchema);

module.exports = Recipe;