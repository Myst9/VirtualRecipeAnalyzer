import React, { useState, useEffect } from 'react';
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
  const [ingredients, setIngredients] = useState([]);
  useEffect(() => {
    const storedIngredients = JSON.parse(localStorage.getItem('selectedIngredients'));
    if (storedIngredients && selectedIngredients.length === 0) {
      setSelectedIngredients(storedIngredients);
    }
  }, []);

  useEffect(() => {
    const storedDetails = JSON.parse(localStorage.getItem('nutritionalDetails'));
    if (storedDetails) {
      setNutritionalDetails(storedDetails);
    }
  }, []);

useEffect(() => {
  fetch("http://localhost:4000/recipes/get-images")
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json(); 
    })
    .then(data => {
      setIngredients(data); 
      console.log(ingredients);
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
}, []);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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
    const updatedBowlImages = bowlImages.filter(
      (bowlImage) => bowlImage.imageId !== imageId
    );
    setBowlImages(updatedBowlImages);
  };

  const handleClearAll = () => {
    setSelectedIngredients([]); 
  };

  const handleAnalyzeRecipe = () => {
    setIsAnalyzing(true);

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
        localStorage.setItem('nutritionalDetails', JSON.stringify(data));
        setTimeout(() => setIsAnalyzing(false), 4000);
      })
      .catch((error) => {
        console.error(error);
        setIsAnalyzing(false);
      });
  };

  const filteredIngredients = ingredients.filter((ingredient) =>
    ingredient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    // Save selected ingredients to localStorage whenever it changes
    localStorage.setItem('selectedIngredients', JSON.stringify(selectedIngredients));
  }, [selectedIngredients]);

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
            <button
              onClick={() => setSearchQuery('')}
              style={{
                backgroundColor: '#007bff',
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
            >
              Clear
            </button>
          </div>
          <div
            className="ingredient-list"
            style={{ width: '300px', maxHeight: '550px', overflowY: 'scroll' }}
          >
            {filteredIngredients.map((ingredient, index) => (
              <div
                key={index}
                style={{ padding: '5px' }}
                className={`ingredient-card ${
                  selectedIngredients.find((item) => item.name === ingredient.name)
                    ? 'selected'
                    : ''
                }`}
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
                    border: 'none',
                  }}
                >
                  X
                </button>
                <h6>
                  {ingredient.name} - {ingredient.quantity} g
                </h6>
              </div>
            ))}
          </div>
          <div className="analysis-section">
            <button
              onClick={handleAnalyzeRecipe}
              disabled={selectedIngredients.length === 0}
              style={{
                backgroundColor:
                  selectedIngredients.length === 0 ? '#ccc' : '#007bff',
                color: 'white',
                borderRadius: '4px',
                padding: '10px 20px',
                border: 'none',
                cursor: 'pointer',
                outline: 'none',
                fontWeight: 'bold',
                fontSize: '16px',
              }}
            >
              Analyze Recipe
            </button>
            <button
              onClick={handleClearAll} 
              style={{
                backgroundColor: '#e63e3e', 
                color: 'white',
                borderRadius: '4px',
                padding: '10px 20px',
                border: 'none',
                cursor: 'pointer',
                outline: 'none',
                fontWeight: 'bold',
                fontSize: '16px',
              }}
            >
              Clear All 
            </button>
          </div>
        </div>

        <div className="nutritional-details" style={{ flex: 1 }}>
          {isAnalyzing ? (
            <div className="loading-message">
              <Modal
                isOpen={isAnalyzing}
                onRequestClose={() => setIsAnalyzing(false)}
                style={modalStyles}
                contentLabel="Analyzing Recipe"
              >
                <img
                  src="pan_gif.gif"
                  alt="Bowl Animation"
                  style={{
                    maxWidth: '200px',
                    maxHeight: '200px',
                    animation: 'bowlAnimation 2s infinite',
                  }}
                />
                <p>Analyzing Recipe...</p>
              </Modal>
            </div>
          ) : nutritionalDetails ? (
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
          ) : (
            <div>
              <h2>Nutritional Details</h2>
              <p>No nutritional details available.</p>
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
          <button
            onClick={() => handleAddIngredient(ingredientToSelect?.quantity)}
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
          >
            Add
          </button>
          <button
            onClick={() => setIngredientToSelect(null)}
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
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
}