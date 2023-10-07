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

  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredIngredients = ingredients.filter((ingredient) =>
    ingredient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="recipe-container">
      <div className="ingredients-container" style={{ display: 'flex' }}>
        <div className="ingredients-section" style={{ flex: 1 }}>
          <h2>Ingredients</h2>
          <div className="ingredient-search">
            <input
              type="text"
              placeholder="Search ingredients"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button onClick={() => setSearchQuery('')}
              style={{
                backgroundColor: '#007bff', // Change the color to match your design
                color: 'white',
                borderRadius: '4px',
                padding: '2px 10px',
                border: 'none',
                cursor: 'pointer',
                outline: 'none',
                fontWeight: 'bold',
                fontSize: '16px',
                marginLeft: '10px',
              }}
            >Clear</button>
          </div>
          <div className="ingredient-list" style={{ width: '300px', maxHeight: '550px', overflowY: 'scroll' }}>
            {filteredIngredients.map((ingredient, index) => (
              <div
                key={index}
                style={{ padding: '5px' }}
                className={`ingredient-card ${selectedIngredients.find((item) => item.name === ingredient.name) ? 'selected' : ''}`}
                onClick={() => handleIngredientSelect(ingredient)}
              >
                <img
                  src={ingredient.imageUrl}
                  alt={ingredient.name}
                  style={{ maxWidth: '100px', maxHeight: '100px' }}
                />
                <h6>{ingredient.name}</h6>
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
                <button
                  className="remove-button"
                  onClick={() => handleRemoveIngredient(ingredient.name)}
                  style={{
                    backgroundColor: 'red',
                    color: 'white',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    display: 'inline-block',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    outline: 'none',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    marginLeft: '10px',
                    border: 'none', // Added to remove button border
                  }}
                >
                  X
                </button>
                <h6>{ingredient.name} - {ingredient.quantity} g</h6>
              </div>
            ))}
          </div>
          <div className="analysis-section">
            <button onClick={handleAnalyzeRecipe} disabled={selectedIngredients.length === 0}
              style={{
                backgroundColor: selectedIngredients.length === 0 ? '#ccc' : '#007bff', // Change button color when disabled
                color: 'white',
                borderRadius: '4px', // Added border radius for a rounded look
                padding: '10px 20px', // Added padding for better button size
                border: 'none',
                cursor: 'pointer',
                outline: 'none',
                fontWeight: 'bold',
                fontSize: '16px',
              }}
            >
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
          <button onClick={() => handleAddIngredient(ingredientToSelect?.quantity)}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              borderRadius: '4px',
              padding: '10px 20px',
              border: 'none',
              cursor: 'pointer',
              outline: 'none',
              fontWeight: 'bold',
              fontSize: '16px',
            }}
          >Add</button>
          <button onClick={() => setIngredientToSelect(null)}
            style={{
              backgroundColor: '#ccc',
              color: '#007bff',
              borderRadius: '4px',
              padding: '10px 20px',
              border: 'none',
              cursor: 'pointer',
              outline: 'none',
              fontWeight: 'bold',
              fontSize: '16px',
              marginLeft: '10px',
            }}
          >Cancel</button>
        </div>
      </Modal>
    </div>
  );
}
