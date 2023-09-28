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

module.exports = router;