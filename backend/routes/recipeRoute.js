const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipeController");

router.post("/analyze-recipe", (req, res) => {
	// let data = {
	// 	userId: auth.decode(req.headers.authorization).id,
	// 	recipe: req.body
	// };

	recipeController.analyzeRecipe(req.body).then(resultFromController => res.send(
		resultFromController));
});

router.get("/get-images", (req, res) => {
	recipeController.getImages().then(resultFromController => res.send(resultFromController));
});

router.get("/ingredient-names", (req, res) => {
	recipeController.getIngredients().then(resultFromController => res.send(resultFromController));
});

router.post("/get-units", (req, res) => {
	recipeController.getUnits(req.body).then(resultFromController => res.send(resultFromController));
})

module.exports = router;