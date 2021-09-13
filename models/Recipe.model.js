const { Schema, model } = require('mongoose');

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const recipeSchema = new Schema({

    apiDBId: String,
    image: String,
    title: String,
    ingredients: [{ name: String, isMissing: false }],
    instructions: [String]

    // favorites: [{ type: Schema.Types.ObjectId, ref: 'Room', default: [] }]
});

const User = model('Recipe', recipeSchema);

module.exports = User;