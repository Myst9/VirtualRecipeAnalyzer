import React, { useState } from 'react';

export default function Recipes() {
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [nutritionalDetails, setNutritionalDetails] = useState(null);
  const [ingredients] = useState([
    { name: 'Milk, whole', imageUrl: 'milk.jpg' },
    { name: 'Yogurt, low fat milk, plain', imageUrl: 'yogurt.jpg' },
  ]);

  const handleIngredientSelect = (ingredient) => {
    const quantity = prompt(`Enter quantity (in grams) for ${ingredient.name}:`);
    if (quantity !== null && quantity !== '') {
      const newIngredient = { ...ingredient, quantity };
      setSelectedIngredients([...selectedIngredients, newIngredient]);
    }
  };

  const handleRemoveIngredient = (ingredientName) => {
    const updatedIngredients = selectedIngredients.filter(
      (ingredient) => ingredient.name !== ingredientName
    );
    setSelectedIngredients(updatedIngredients);
  };

  const handleAnalyzeRecipe = () => {
    const formattedIngredients = selectedIngredients.map(({ name, quantity }) => ({
      name,
      quantity,
    }));

    fetch('http://localhost:4000/recipes/analyze-recipe', {
      method: 'POST',
      body: JSON.stringify({ ingredients: formattedIngredients }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setNutritionalDetails(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="recipe-container">
      <div className="ingredients-section">
        <h2>Selected Ingredients</h2>
        <ul>
          {selectedIngredients.map((ingredient, index) => (
            <li key={index}>
              {ingredient.name} - {ingredient.quantity} g{' '}
              <button onClick={() => handleRemoveIngredient(ingredient.name)}>Remove</button>
            </li>
          ))}
        </ul>
        <h2>Ingredients</h2>
        <div className="ingredient-list">
          {ingredients.map((ingredient, index) => (
            <div
              key={index}
              className={`ingredient-card ${
                selectedIngredients.find((item) => item.name === ingredient.name) ? 'selected' : ''
              }`}
              onClick={() => handleIngredientSelect(ingredient)}
            >
              <img
                src={ingredient.imageUrl}
                alt={ingredient.name}
                style={{ maxWidth: '100px', maxHeight: '100px' }}
              />
              <h3>{ingredient.name}</h3>
            </div>
          ))}
        </div>
      </div>
      <div className="analysis-section">
        <button onClick={handleAnalyzeRecipe} disabled={selectedIngredients.length === 0}>
          Analyze Recipe
        </button>
        {nutritionalDetails && (
          <div>
            <h2>Nutritional Details</h2>
            <table>
              <thead>
                <tr>
                  <th>Nutrient Name</th>
                  <th>Amount</th>
                  <th>Unit</th>
                </tr>
              </thead>
              <tbody>
                {nutritionalDetails.map((detail, index) => (
                  <tr key={index}>
                    <td>{detail.nutrientName}</td>
                    <td>{detail.nutrientAmount}</td>
                    <td>{detail.nutrientUnit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
  
}

