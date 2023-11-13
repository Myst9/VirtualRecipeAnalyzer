import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Form } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import Swal from 'sweetalert2';
import nutrientCategories from '../utils/nutrientCategories';

export default function PostDetails() {
  const [post, setPost] = useState(null);
  const { postId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editingIngredientIndex, setEditingIngredientIndex] = useState(null);
  const [editedDescription, setEditedDescription] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [ingredientOptions, setIngredientOptions] = useState([]); // Define your ingredient options
  const [selectedIngredientToAddQuantity, setSelectedIngredientToAddQuantity] = useState(null);
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [quantityInput, setQuantityInput] = useState('');
  const [unitsOptions, setUnitsOptions] = useState([]);
  const [unit, setUnit] = useState('');
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [nutritionalAnalysis, setNutritionalAnalysis] = useState(null);

  useEffect(() => {
		document.body.style.backgroundImage = `url(/brooke-lark-1.jpg)`;
		
		return () => {
		  document.body.style.backgroundImage = null;
		};
	  }, []);

  const imageUrl = `${process.env.REACT_APP_API_URL}/posts/image/${postId}`;

  useEffect(() => {
    // Make a request to your backend to get the user's information
    fetch(`${process.env.REACT_APP_API_URL}/users/details`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((response) => response.json())
      .then((userData) => {
        setUser(userData);
        console.log(userData);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  }, []);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/recipes/ingredient-names`)
      .then((response) => response.json())
      .then((data) => {
        const options = data.map((ingredient) => ({
          label: ingredient,
          value: ingredient,
        }));
        setIngredientOptions(options);
      })
      .catch((error) => {
        console.error('Error fetching ingredient names:', error);
      });
  }, []);

  const isCurrentUserPost = post && user && post.userId === user.name;

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/posts/${postId}`, {
      method: 'GET',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setPost(data);

        // Initialize selectedIngredients based on existing post's ingredients
        setSelectedIngredients(data.ingredients ? [...data.ingredients] : []);
      })
      .catch((error) => console.error('Error fetching post:', error));
  }, [postId]);

  useEffect(() => {
    fetchUnits();
  }, [selectedIngredientToAddQuantity]); // Run this effect when selectedIngredientToAddQuantity changes

  const fetchUnits = async () => {
    if (selectedIngredientToAddQuantity) {
      try {
        // Fetch units for the selected ingredient
        const response = await fetch(`${process.env.REACT_APP_API_URL}/recipes/get-units`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ name: selectedIngredientToAddQuantity.label }),
        });

        if (response.ok) {
          const unitsData = await response.json();
          const unitsOptions = unitsData.map((unit) => ({ label: unit, value: unit }));
          setUnitsOptions(unitsOptions);
        } else {
          console.error('Error fetching units:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching units:', error);
      }
    }
  };

  const handleAnalyzeClick = () => {
    // Make a request to fetch nutritional analysis
    fetch(`${process.env.REACT_APP_API_URL}/recipes/analyze-recipe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        ingredients: selectedIngredients,
      }),
    })
      .then((response) => response.json())
      .then((analysisData) => {
        setNutritionalAnalysis(analysisData);
        setShowAnalysisModal(true);
        console.log(analysisData);
      })
      .catch((error) => {
        console.error('Error fetching nutritional analysis:', error);
      });
  };

  const handleIngredientSelect = (selectedOption) => {
    if (selectedOption) {
      setSelectedIngredientToAddQuantity(selectedOption);
      setShowQuantityModal(true);
    }
  };

  const handleQuantityModalAdd = async (quantity) => {
    setShowQuantityModal(false);
    const numericQuantity = parseFloat(quantity);
    const newIngredient = {
      name: selectedIngredientToAddQuantity.label,
      quantity: numericQuantity,
      unit: unit,
    };
    // Modify selectedIngredients based on whether you are editing or adding a new ingredient
    if (editingIngredientIndex !== null) {
      const updatedIngredients = [...selectedIngredients];
      updatedIngredients[editingIngredientIndex] = newIngredient;
      setSelectedIngredients(updatedIngredients);
      setEditingIngredientIndex(null);
    } else {
      setSelectedIngredients([...selectedIngredients, newIngredient]);
    }
  };

  const handleQuantityModalCancel = () => {
    setShowQuantityModal(false);
    setSelectedIngredientToAddQuantity(null);
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleEditClick = () => {
    setEditModalOpen(true);
    setEditedTitle(post.title);
    setEditedDescription(post.description);
    setSelectedIngredients(post.ingredients || []);
  };

  const handleIngredientRemove = (index) => {
    const updatedIngredients = [...selectedIngredients];
    updatedIngredients.splice(index, 1);
    setSelectedIngredients(updatedIngredients);
  };

  const handleSaveChangesClick = () => {
    // Make a request to update the post with the edited values
    fetch(`${process.env.REACT_APP_API_URL}/posts/${postId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        title: editedTitle,
        description: editedDescription,
        ingredients: selectedIngredients,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((updatedPost) => {
        if (!updatedPost) {
          console.error('Error updating post');
          // Handle the error, show a message, or take appropriate action
        } else {
          // Update the local state with the updated post
          setPost(updatedPost);
          setEditModalOpen(false);

          // Show success alert
          Swal.fire({
            icon: 'success',
            title: 'Post Updated',
            text: 'Your post has been successfully updated!',
          });
        }
      })
      .catch((error) => {
        console.error('Error updating post:', error);

        // Show error alert
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred while updating the post.',
        });
      });
  };



  const handleEditIngredientClick = (index) => {
    setEditingIngredientIndex(index === editingIngredientIndex ? null : index);
  };

  const handleEditIngredientChange = (e, index, property) => {
    const updatedIngredients = [...selectedIngredients];
    updatedIngredients[index][property] = property === 'quantity' ? parseFloat(e.target.value) : e.target.value;
    setSelectedIngredients(updatedIngredients);
  };

  const handleDeleteClick = () => {
    // Confirm with the user before deleting
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");

    if (confirmDelete) {
      // Make a DELETE request to delete the post
      fetch(`${process.env.REACT_APP_API_URL}/posts/${postId}`, {
        method: 'POST',
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(result => {
          console.log(result);
          // Redirect to the posts page 
          navigate('/posts');
        })
        .catch(error => console.error('Error deleting post:', error));
    }
  };

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

  const categorizedNutrients = categorizeNutrients(nutritionalAnalysis || []);

  const calculateTotalWeight = (category) => {
    if (nutritionalAnalysis) {
      const totalWeight = categorizedNutrients[category].reduce((total, detail) => {
        // Check if nutrientAmount is a valid number
        if (!isNaN(parseFloat(detail.nutrientAmount))) {
          return total + parseFloat(detail.nutrientAmount);
        }
        return total;
      }, 0);

      const formattedTotalWeight = (Math.round(totalWeight * 100) / 100).toFixed(2);
      const unit = categorizedNutrients[category][0].nutrientUnit; // Use the unit from the first nutrient

      return `${formattedTotalWeight} ${unit}`;
    }
    return '0 mg'; // Return '0 mg' if nutritionalDetails is not available
  };

  const totalProteinWeight = calculateTotalWeight('Proteins and Aminoacids');
  const totalCarbohydrateWeight = calculateTotalWeight('Carbohydrates');
  const totalFatWeight = calculateTotalWeight('Fat');
  const totalVitaminsWeight = calculateTotalWeight('Vitamins');
  const totalMineralsWeight = calculateTotalWeight('Minerals');
  const totalEnergy = calculateTotalWeight('Energy');

  return (
    <div className='mt-5'>
      <Container>
        <Row>
          <Col lg={{ span: 6, offset: 3 }}>
            {post ? (
              <Card className="cardHighlight p-0">
                <Card.Body>
                  {imageUrl && (
                    <div className="text-center">
                      <img
                        src={imageUrl}
                        alt="Post Image"
                        style={{ maxWidth: '100%', maxHeight: '100%' }}
                        className="centered-image"
                      />
                    </div>
                  )}
                  <h4 className="text-center mb-4">{post.title}</h4>
                  <Card.Subtitle>Posted by:</Card.Subtitle>
                  <Card.Text>{post.userId}</Card.Text>

                  <Card.Subtitle>Ingredients:</Card.Subtitle>
                  <ul>
                    {post.ingredients ? (
                      post.ingredients.map((ingredient, index) => (
                        <li key={index}>
                          {ingredient.name}: {ingredient.quantity} {ingredient.unit}
                        </li>
                      ))
                    ) : (
                      <li>No ingredients available</li>
                    )}
                  </ul>

                  {/* Analyze button */}
                  <div className="text-center">
                    <Button variant="info" onClick={handleAnalyzeClick}>
                      Analyze
                    </Button>
                  </div>

                  {showAnalysisModal && (
                    <Modal show={showAnalysisModal} onHide={() => setShowAnalysisModal(false)}>
                      <Modal.Header closeButton>
                        <Modal.Title>Nutritional Analysis</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        {nutritionalAnalysis ? (
                          <div>
                            <table className="table">
                              <thead>
                                <tr>
                                  <th>Category</th>
                                  <th>Amount</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>Total Protein</td>
                                  <td>{totalProteinWeight} </td>
                                </tr>
                                <tr>
                                  <td>Total Carbohydrate</td>
                                  <td>{totalCarbohydrateWeight} </td>
                                </tr>
                                <tr>
                                  <td>Total Fat</td>
                                  <td>{totalFatWeight} </td>
                                </tr>
                                {/* <tr>
                <td>Total Vitamins Weight</td>
                <td>{totalVitaminsWeight} </td>
              </tr>
              <tr>
                <td>Total Minerals Weight</td>
                <td>{totalMineralsWeight} </td>
              </tr> */}
                                <tr>
                                  <td>Total Energy</td>
                                  <td>{totalEnergy} </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <p>Loading nutritional analysis...</p>
                        )}
                      </Modal.Body>
                    </Modal>
                  )}


                  <Card.Subtitle>Description:</Card.Subtitle>
                  <Card.Text>{post.description}</Card.Text>

                  {/* Edit and Delete buttons */}
                  {isCurrentUserPost && (
                    <div className="text-center">
                      <Button variant="primary" onClick={handleEditClick}>
                        Edit
                      </Button>{' '}
                      <Button variant="danger" onClick={handleDeleteClick}>
                        Delete
                      </Button>
                    </div>
                  )}

                  {editModalOpen && (
                    <Modal show={editModalOpen} onHide={() => setEditModalOpen(false)}>
                      <Modal.Header closeButton>
                        <Modal.Title>Edit Post</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <Form>
                          <Form.Group controlId="editTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Enter title"
                              value={editedTitle}
                              onChange={(e) => setEditedTitle(e.target.value)}
                            />
                          </Form.Group>
                          <Form.Group controlId="editDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={3}
                              placeholder="Enter description"
                              value={editedDescription}
                              onChange={(e) => setEditedDescription(e.target.value)}
                            />
                          </Form.Group>

                          <Form.Group controlId="editIngredients">
                            <Form.Label>Ingredients</Form.Label>
                            <Select
                              isSearchable
                              isClearable
                              placeholder="Select an ingredient"
                              options={ingredientOptions}
                              onChange={handleIngredientSelect}
                            />
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                              {selectedIngredients.map((ingredient, index) => (
                                <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                  <div>
                                    {ingredient.name}: {ingredient.quantity} {ingredient.unit}
                                  </div>
                                  <Button
                                    variant="danger"
                                    size="sm"
                                    style={{ marginLeft: '8px' }}
                                    onClick={() => handleIngredientRemove(index)}
                                  >
                                    Remove
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </Form.Group>

                        </Form>
                      </Modal.Body>
                      <Modal.Footer>
                        <div>
                          <Button variant="secondary" onClick={() => setEditModalOpen(false)}>
                            Cancel
                          </Button>
                          <Button variant="primary" onClick={handleSaveChangesClick}>
                            Save Changes
                          </Button>
                        </div>
                      </Modal.Footer>
                    </Modal>
                  )}

                  <Button variant="primary" onClick={handleBackClick}>
                    Back
                  </Button>
                </Card.Body>

                {showQuantityModal && (
                  <Modal show={showQuantityModal} onHide={handleQuantityModalCancel}>
                    <Modal.Header closeButton>
                      <Modal.Title>Add/Edit Ingredient Quantity</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <Form.Control
                        type="number"
                        placeholder={`Enter quantity for ${selectedIngredientToAddQuantity?.label}`}
                        onChange={(e) => setQuantityInput(e.target.value)}
                      />
                      <Select
                        isSearchable
                        isClearable
                        placeholder="Select unit"
                        options={unitsOptions}
                        onChange={(selectedOption) => setUnit(selectedOption?.value)}
                      />
                    </Modal.Body>
                    <Modal.Footer>
                      <Button variant="secondary" onClick={handleQuantityModalCancel}>
                        Cancel
                      </Button>
                      <Button variant="primary" onClick={() => handleQuantityModalAdd(quantityInput)}>
                        Add/Edit
                      </Button>
                    </Modal.Footer>
                  </Modal>
                )}
              </Card>
            ) : (
              <p>Loading post details...</p>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}
