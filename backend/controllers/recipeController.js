const fs = require('fs');
const path = require('path');
const Recipe = require("../models/Recipe");
const Post = require("../models/Post");

const filePath = path.join(__dirname, '../data/FoodData_Central_survey_food_json_2022-10-28.json');
const nutrientData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
const surveyFoods = nutrientData.SurveyFoods;

module.exports.analyzeRecipe = async (data) => {
    try {
        const nutrientTotals = [];
        const ingredients = data.ingredients;

        // Create a map to store the total nutrients and their units
        const totalNutrients = {};

        for (const ingredient of ingredients) {
            const surveyFood = nutrientData.SurveyFoods.find((food) => food.description === ingredient.name);

            if (surveyFood) {
                // Determine the appropriate unit and weight from portionDescription
                let unit = 'g'; // Default to grams
                let weight = 1; // Default to 100 grams

                if (ingredient.unit && ingredient.unit !== 'g') {
                    const portion = surveyFood.foodPortions.find((portion) => portion.portionDescription.toLowerCase() === ingredient.unit.toLowerCase());
                    const portion2 = surveyFood.foodPortions.find((portion) => portion.portionDescription.toLowerCase() === "1 " + ingredient.unit.toLowerCase());
                    if (portion) {
                        unit = 'g';
                        weight = portion.gramWeight;
                    }
                    else if (portion2) {
                        unit = 'g';
                        weight = portion2.gramWeight;
                    }
                }

                for (const nutrient of surveyFood.foodNutrients) {
                    const nutrientName = nutrient.nutrient.name;
                    const nutrientAmount = ((nutrient.amount / 100) * weight * ingredient.quantity).toFixed(2);
                    const nutrientUnit = nutrient.nutrient.unitName; // Get the unit name

                    // Add or update the total nutrients and their units
                    if (totalNutrients[nutrientName]) {
                        totalNutrients[nutrientName].amount += parseFloat(nutrientAmount);
                    } else {
                        totalNutrients[nutrientName] = {
                            amount: parseFloat(nutrientAmount),
                            unit: nutrientUnit, // Store the unit name
                        };
                    }
                }
            }
        }

        // Convert total nutrients into an array of objects
        for (const nutrientName in totalNutrients) {
            nutrientTotals.push({
                nutrientName,
                nutrientAmount: totalNutrients[nutrientName].amount.toFixed(2),
                nutrientUnit: totalNutrients[nutrientName].unit, 
            });
        }

        return nutrientTotals;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

module.exports.getImages = async () => {
    return new Promise((resolve, reject) => {
        try {
            let result = [];
            for (const food of surveyFoods) {
                const name = food.description;
                const imageUrl = `${name}.jpg`;
                result.push({
                    name: name,
                    imageUrl: imageUrl,
                });
            }
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
};

module.exports.getUnits = async (data) => {
    return new Promise((resolve, reject) => {
        try {
            let units = ["g"];
            const food = nutrientData.SurveyFoods.find((food) => food.description === data.name);
            for (const portion of food.foodPortions) {
                    let measure = portion.portionDescription.replace(/^1 /, '');
                    if(measure!="Quantity not specified"){
                        units.push(measure);
                    }
                }
            resolve(units);
        } catch (error) {
            reject(error);
        }
    });
}

module.exports.getIngredients = async () => {
    return new Promise((resolve, reject) => {
        try {
            let result = [];
            for (const food of surveyFoods) {
                const name = food.description;
                result.push(name);
            }
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
};

module.exports.getSimilarRecipes = async (data) => {
  try {
    const userIngredients = data.ingredients;
    const matchedRecipes = [];

    // Calculate the Jaccard similarity for each recipe and filter recipes with a match above 60%
    const recipes = await Post.find();

    recipes.forEach((recipe) => {
        //console.log(recipe);
        const ingredientNames = new Set();
      recipe.ingredients.forEach((ingredient) => {
        ingredientNames.add(ingredient.name);
      });
      //console.log(ingredientNames);
      const intersection = userIngredients.filter((ingredient) => ingredientNames.has(ingredient));
      const union = new Set([...userIngredients, ...ingredientNames]);
      const similarity = intersection.length / union.size;

      if (similarity >= 0.05) {
        const recipeId = recipe._id
        //console.log(recipeId);
        matchedRecipes.push({
          recipeId : recipeId,
          similarity : similarity,
        });
      }
    });

    // Sort the matched recipes by similarity in descending order
    matchedRecipes.sort((a, b) => b.similarity - a.similarity);

    return matchedRecipes.map((matchedRecipe) => matchedRecipe.recipeId);
  } catch (error) {
    console.error(error);
    throw new Error('Internal server error');
  }
};

