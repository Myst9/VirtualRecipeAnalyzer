import React, { useState } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const modalStyles = {
  content: {
    width: '300px',
    height: '300px',
    margin: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export default function Recipes() {
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [ingredientToSelect, setIngredientToSelect] = useState(null);
  const [nutritionalDetails, setNutritionalDetails] = useState(null);
  const [bowlImages, setBowlImages] = useState([]);
  const [ingredients] = useState([
    { name: 'Milk, whole', imageUrl: 'milkjug.jpg' },
    { name: 'Yogurt, low fat milk, plain', imageUrl: 'yogurt.jpg' },
    { name: 'Cashews, unroasted', imageUrl: 'cashews.jpg' },
    { name: 'Almonds, unroasted', imageUrl: 'almonds.jpg' },
    { name: 'Pistachio nuts, salted', imageUrl: 'pistachios.jpg' },
    { name: 'Bread, white', imageUrl: 'bread.jpg' },
  ]);

  const handleIngredientSelect = (ingredient) => {
    setIngredientToSelect(ingredient);
  };

  const handleAddIngredient = (quantity) => {
    if (quantity !== null && quantity !== '') {
      const newIngredient = { ...ingredientToSelect, quantity };
      setSelectedIngredients([...selectedIngredients, newIngredient]);
      setIngredientToSelect(null);
    }
  };

  const handleRemoveIngredient = (ingredientName) => {
    const updatedIngredients = selectedIngredients.filter(
      (ingredient) => ingredient.name !== ingredientName
    );
    setSelectedIngredients(updatedIngredients);
  };

  const handleRemoveFromBowl = (imageId) => {
    const updatedBowlImages = bowlImages.filter((bowlImage) => bowlImage.imageId !== imageId);
    setBowlImages(updatedBowlImages);
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
      <div className="ingredients-container" style={{ display: 'flex' }}>
        <div className="ingredients-section" style={{ flex: 1 }}>
          <h2>Ingredients</h2>
          <div className="ingredient-list" style={{ width: '300px', maxHeight: '600px', overflowY: 'scroll' }}>
            {ingredients.map((ingredient, index) => (
              <div
                key={index}
                className={`ingredient-card ${selectedIngredients.find((item) => item.name === ingredient.name) ? 'selected' : ''
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

        <div className="ingredients-section" style={{ flex: 1 }}>
          <h2>Selected Ingredients</h2>
          <div className="selected-ingredient-list">
            {selectedIngredients.map((ingredient, index) => (
              <div key={index} className="selected-ingredient">
                <img
                  src={ingredient.imageUrl} 
                  alt={ingredient.name}
                  style={{ maxWidth: '100px', maxHeight: '100px' }}
                />
                <span>{ingredient.name} - {ingredient.quantity} g</span>
                <button onClick={() => handleRemoveIngredient(ingredient.name)}>Remove</button>
              </div>
            ))}
          </div>
          <div className="analysis-section">
            <button onClick={handleAnalyzeRecipe} disabled={selectedIngredients.length === 0}>
              Analyze Recipe
            </button>
          </div>
        </div>

        <div className="nutritional-details" style={{ flex: 1 }}>
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

      <Modal
        isOpen={!!ingredientToSelect}
        onRequestClose={() => setIngredientToSelect(null)}
        contentLabel="Enter Quantity"
        style={modalStyles}
      >
        <h2>Enter Quantity (in grams) for {ingredientToSelect?.name}:</h2>
        <input
          type="number"
          value={ingredientToSelect?.quantity || ''}
          onChange={(e) => {
            const quantity = e.target.value;
            setIngredientToSelect({ ...ingredientToSelect, quantity });
          }}
        />
        <div>
          <button onClick={() => handleAddIngredient(ingredientToSelect?.quantity)}>Add</button>
          <button onClick={() => setIngredientToSelect(null)}>Cancel</button>
        </div>
      </Modal>
    </div>
  );
}
