const { Schema, model } = require('mongoose');

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
<<<<<<< HEAD
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    // favorites: [{ type: Schema.Types.ObjectId, ref: 'Room', default: [] }]
=======
	username: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
    recipes: [{
        type: Schema.Types.ObjectId, ref: 'Recipe', default: []
    }]
	// favorites: [{ type: Schema.Types.ObjectId, ref: 'Room', default: [] }]
>>>>>>> ba1af9504f9b9b41999d6bdabfaa757d2d6ba153
});

const User = model('User', userSchema);

module.exports = User;
