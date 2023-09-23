const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
	userId: {
		type: String,
		required: [true, "UserId is required."]
	},
	ingredients: [
		{
			ingredientId: {
				type: String,
				required: [true, "IngredientId is required."]
			},
			quantity: {
				type: Number,
				required: [true, "Quantity is required."]
			}
		}
	]
})

module.exports = mongoose.model("Recipe", recipeSchema);