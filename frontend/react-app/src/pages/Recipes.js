import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';

Modal.setAppElement('#root');

const modalStyles = {
  content: {
    width: '350px',
    height: '350px',
    margin: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
};


const nutrientCategories = {
  Vitamins: [
    'Vitamin A, RAE',
    'Carotene, alpha',
    'Carotene, beta',
    'Cryptoxanthin, beta',
    'Lutein + zeaxanthin',
    'Lycopene',
    'Retinol',
    'Thiamin',
    'Riboflavin',
    'Niacin',
    'Vitamin B-6',
    'Vitamin B-12',
    'Vitamin B-12, added',
    'Folate, total',
    'Folate, food',
    'Folic acid',
    'Vitamin C, total ascorbic acid',
    'Vitamin D (D2 + D3)',
    'Vitamin E (alpha-tocopherol)',
    'Vitamin E, added',
    'Tocopherol, alpha',
    'Tocopherol, beta',
    'Tocopherol, delta',
    'Tocopherol, gamma',
    'Tocotrienol, alpha',
    'Tocotrienol, beta',
    'Tocotrienol, delta',
    'Tocotrienol, gamma',
    'Vitamin K (phylloquinone)',
    'Carotene, beta',
    'Carotene, alpha',
    'Cryptoxanthin, beta',
    'Lycopene',
    'Lutein + zeaxanthin',
    'Choline, total',
    'Folate, DFE',
  ],
  Fat: [
    'Total lipid (fat)',
    'Fatty acids, total saturated',
    'SFA 4:0',
    'SFA 6:0',
    'SFA 8:0',
    'SFA 10:0',
    'SFA 12:0',
    'SFA 14:0',
    'SFA 16:0',
    'SFA 18:0',
    'Fatty acids, total monounsaturated',
    'MUFA 16:1',
    'MUFA 18:1',
    'MUFA 20:1',
    'MUFA 22:1',
    'Fatty acids, total polyunsaturated',
    'PUFA 18:2',
    'PUFA 18:3',
    'PUFA 20:4',
    'PUFA 22:6 n-3 (DHA)',
    'PUFA 18:4',
    'PUFA 20:1',
    'PUFA 20:5 n-3 (EPA)',
    'PUFA 22:1',
    'PUFA 22:5 n-3 (DPA)',
  ],
  Minerals: [
    'Calcium, Ca',
    'Iron, Fe',
    'Magnesium, Mg',
    'Phosphorus, P',
    'Potassium, K',
    'Sodium, Na',
    'Zinc, Zn',
    'Copper, Cu',
    'Selenium, Se',
  ],
  Carbohydrates: [
    'Carbohydrate, by difference',
    'Sugars, total including NLEA',
    'Fiber, total dietary',
    'Starch',
    'Net carbs',
  ],
  'Proteins and Aminoacids': ['Protein'],
  Sterols: ['Cholesterol'],
  Other: ['Alcohol, ethyl', 'Water', 'Caffeine', 'Theobromine'],
  Energy: [],
};

export default function Recipes() {
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [ingredientToSelect, setIngredientToSelect] = useState(null);
  const [nutritionalDetails, setNutritionalDetails] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [ingredientUnits, setIngredientUnits] = useState([]);
  const navigate = useNavigate();

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

  const Button = ({ onClick, disabled, label, color }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        backgroundColor: disabled ? '#ccc' : color,
        color: 'white',
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
      {label}
    </button>
  );

  const handleIngredientSelect = (ingredient) => {
    setIngredientToSelect(ingredient);
    fetch('http://localhost:4000/recipes/get-units', {
      method: 'POST',
      body: JSON.stringify({ name: ingredient.name }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setIngredientUnits(data);
      })
      .catch((error) => {
        console.error('Error fetching units:', error);
      });
  };

  const handleAddIngredient = (quantity) => {
    if (quantity !== null && quantity !== '') {
      // Check if the ingredient is already in selectedIngredients
      const existingIngredientIndex = selectedIngredients.findIndex(
        (ingredient) => ingredient.name === ingredientToSelect.name
      );

      if (existingIngredientIndex !== -1) {
        const updatedIngredients = [...selectedIngredients];
        updatedIngredients[existingIngredientIndex].quantity = quantity;
        updatedIngredients[existingIngredientIndex].unit = ingredientToSelect.selectedUnit;

        setSelectedIngredients(updatedIngredients);
      } else {
        const newIngredient = { ...ingredientToSelect, quantity, unit: ingredientToSelect.selectedUnit };
        setSelectedIngredients([...selectedIngredients, newIngredient]);
      }

      setIngredientToSelect(null);
    }
  };

  const clearNutritionalDetails = () => {
    setNutritionalDetails(null);
    localStorage.removeItem('nutritionalDetails');
  };

  const handleRemoveIngredient = (ingredientName) => {
    const updatedIngredients = selectedIngredients.filter(
      (ingredient) => ingredient.name !== ingredientName
    );
    setSelectedIngredients(updatedIngredients);
  };

  const handleClearAll = () => {
    setSelectedIngredients([]);
    clearNutritionalDetails();
  };

  const handleAnalyzeRecipe = () => {
    setIsAnalyzing(true);

    const formattedIngredients = selectedIngredients.map(({ name, quantity, unit }) => ({
      name,
      quantity,
      unit,
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

  const handleFindRecipe = () => {

    const formattedIngredients = selectedIngredients.map(ingredient => ingredient.name);

    fetch('http://localhost:4000/recipes/find-recipes', {
      method: 'POST',
      body: JSON.stringify({ ingredients: formattedIngredients }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const postIdsString = data.join(',');

        // Redirect to the new page with postIds as query parameters
        navigate(`/similar-recipes?postIds=${postIdsString}`);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    // Save selected ingredients to localStorage whenever it changes
    localStorage.setItem('selectedIngredients', JSON.stringify(selectedIngredients));
  }, [selectedIngredients]);

  const categorizeNutrients = (nutrients) => {
    const categorizedNutrients = {};

    // Initialize categories
    for (const category in nutrientCategories) {
      categorizedNutrients[category] = [];
    }

    // Categorize nutrients
    for (const nutrient of nutrients) {
      let categoryFound = false;

      for (const category in nutrientCategories) {
        if (nutrientCategories[category].includes(nutrient.nutrientName)) {
          categorizedNutrients[category].push(nutrient);
          categoryFound = true;
          break;
        }
      }

      if (!categoryFound) {
        categorizedNutrients['Energy'].push(nutrient);
      }
    }

    return categorizedNutrients;
  };

  const categorizedNutrients = categorizeNutrients(nutritionalDetails || []);

  const tableStyle = {
    borderCollapse: 'collapse',
    width: '100%',
    textAlign: 'left',
  };

  const thStyle = {
    backgroundColor: '#343a40', // Background color for table headers
    color: 'white', // Text color for table headers
    padding: '8px',
    fontWeight: 'bold',
    borderBottom: '1px solid #ddd',
  };

  const tdStyle = {
    border: '1px solid #ddd',
    padding: '8px',
    borderBottom: '1px solid #ddd',
  };

  return (
    <div className="recipe-container">

      <div className="ingredients-container" >
        <div className="up-container" style={{ display: 'flex', flexDirection: 'row', color: 'white', paddingTop: '20px' }}>
          <div className="ingredients-section ">
            {/* <h2 style={{ padding : '10px'}}>Ingredients</h2> */}
            <div className="ingredient-search">
              <input
                type="text"
                placeholder="Search ingredients"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: '8px',
                  fontSize: '16px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  marginRight: '0px',
                }}
              />
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  backgroundColor: '#007bff',
                  color: 'white',
                  borderRadius: '4px',
                  padding: '8px 16px',
                  border: 'none',
                  cursor: 'pointer',
                  outline: 'none',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  marginRight: '25px'
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
                  className={`ingredient-card ${selectedIngredients.find((item) => item.name === ingredient.name)
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

          <div className="selected-ingredient-section">
            <h2 style={{ textAlign: 'center' }}>Selected Ingredients</h2>
            <div className="selected-ingredient-list" style={{ width: '1100px', height: '550px', overflowY: 'scroll', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: '20px' }}>
              {selectedIngredients.map((ingredient, index) => (
                <div key={index} className="selected-ingredient" style={{ marginRight: '10px', marginBottom: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
                  </div>
                  <h6>
                    {ingredient.name} - {ingredient.quantity} {ingredient.unit}
                  </h6>
                </div>
              ))}
            </div>

            <div className="analysis-section" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'right' }}>
              <Button
                onClick={handleFindRecipe}
                disabled={selectedIngredients.length === 0}
                label="Find Recipes"
                color="#007bff"
              />
              <Button
                onClick={handleAnalyzeRecipe}
                disabled={selectedIngredients.length === 0}
                label="Analyze"
                color="#007bff"
              />
              <Button
                onClick={handleClearAll}
                disabled={selectedIngredients.length === 0}
                label="Clear All"
                color="#e63e3e"
              />
            </div>
          </div>
        </div>



        <div className="nutritional-details-section">
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
                  }}
                />
                <p>Analyzing Recipe...Scroll down for the nutritional analysis</p>
              </Modal>
            </div>
          ) : (
            <div style={{ color: 'white' }}>
              <h2>Nutritional Details</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {Object.keys(categorizedNutrients).map((category) => (
                  <div key={category} style={{ flex: '1', minWidth: '400px', margin: '10px' }}>
                    <h3>{category}</h3>
                    <div style={{ width: '100%' }}>
                      <table className="table table-bordered" style={tableStyle}>
                        <thead className="thead-light">
                          <tr>
                            <th style={thStyle}>Nutrient Name</th>
                            <th style={thStyle}>Amount</th>
                            <th style={thStyle}>Unit</th>
                          </tr>
                        </thead>
                        <tbody>
                          {categorizedNutrients[category].map((detail, index) => (
                            <tr key={index}>
                              <td style={tdStyle}>{detail.nutrientName}</td>
                              <td style={tdStyle}>{detail.nutrientAmount}</td>
                              <td style={tdStyle}>{detail.nutrientUnit}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal
    isOpen={!!ingredientToSelect}
    onRequestClose={() => setIngredientToSelect(null)}
    contentLabel="Enter Quantity"
    style={{
      content: {
        width: '350px',
        height: '250px',
        margin: 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      },
      overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
    }}
  >
    <h2 style={{ fontSize: '18px', marginBottom: '15px' }}>Enter Quantity for {ingredientToSelect?.name}:</h2>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <input
        type="number"
        value={ingredientToSelect?.quantity || ''}
        onChange={(e) => {
          const quantity = e.target.value;
          setIngredientToSelect({ ...ingredientToSelect, quantity });
        }}
        style={{
          padding: '8px',
          fontSize: '16px',
          marginBottom: '15px',
          width: '80%',
          border: '1px solid #ccc',
          borderRadius: '4px',
        }}
      />
      <select
        value={ingredientToSelect?.selectedUnit || 'g'}
        onChange={(e) => {
          const selectedUnit = e.target.value;
          setIngredientToSelect({ ...ingredientToSelect, selectedUnit });
        }}
        style={{
          padding: '8px',
          fontSize: '16px',
          marginBottom: '15px',
          width: '80%',
          border: '1px solid #ccc',
          borderRadius: '4px',
        }}
      >
        <option value="">Select Unit</option>
        {ingredientUnits.map((unit, index) => (
          <option key={index} value={unit}>{unit}</option>
        ))}
      </select>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', width: '80%' }}>
      <button
        onClick={() => handleAddIngredient(ingredientToSelect?.quantity)}
        className="modal-button"
        style={{
          backgroundColor: '#28a745',
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
        className="modal-button cancel-button"
        style={{
          backgroundColor: '#dc3545',
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
        Cancel
      </button>
    </div>
  </Modal>
    </div>
  );
}