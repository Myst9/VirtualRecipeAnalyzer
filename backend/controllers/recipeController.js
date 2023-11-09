const fs = require('fs');
const path = require('path');
const Recipe = require("../models/Recipe");

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
                let weight = 100; // Default to 100 grams

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
