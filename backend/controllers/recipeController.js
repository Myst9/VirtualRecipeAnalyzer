const fs = require('fs');
const path = require('path');
const Recipe = require("../models/Recipe");

module.exports.analyzeRecipe = async (data) => {
    try {
        const filePath = path.join(__dirname, '../data/FoodData_Central_survey_food_json_2022-10-28.json');
        const nutrientData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const surveyFoods = nutrientData.SurveyFoods;
        const nutrientTotals = [];
        const ingredients = data.ingredients;

        // Create a map to store the total nutrients and their units
        const totalNutrients = {};

        for (const ingredient of ingredients) {
            const surveyFood = nutrientData.SurveyFoods.find((food) => food.description === ingredient.name);

            if (surveyFood) {
                for (const nutrient of surveyFood.foodNutrients) {
                    const nutrientName = nutrient.nutrient.name;
                    const nutrientAmount = (nutrient.amount / 100) * ingredient.quantity;
                    const nutrientUnit = nutrient.nutrient.unitName; // Get the unit name

                    // Add or update the total nutrients and their units
                    if (totalNutrients[nutrientName]) {
                        totalNutrients[nutrientName].amount += nutrientAmount;
                    } else {
                        totalNutrients[nutrientName] = {
                            amount: nutrientAmount,
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
                nutrientAmount: totalNutrients[nutrientName].amount,
                nutrientUnit: totalNutrients[nutrientName].unit, 
            });
        }

        return nutrientTotals;
    } catch (error) {
        // Handle any errors here
        console.error(error);
        throw error;
    }
};

