import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Row, Col, Form, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Select from 'react-select';

export default function AddPost() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [ingredientOptions, setIngredientOptions] = useState([]);
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [selectedIngredientToAddQuantity, setSelectedIngredientToAddQuantity] = useState(null);
  const [quantityInput, setQuantityInput] = useState('');
  const [user, setUser] = useState(null);
  const [unitsOptions, setUnitsOptions] = useState([]);
  const [unit, setUnit] = useState('');



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

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

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

useEffect(() => {
  fetchUnits();
}, [selectedIngredientToAddQuantity]); // Run this effect when selectedIngredientToAddQuantity changes

const handleIngredientSelect = async (selectedOption) => {
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
    unit: unit
  };
  setSelectedIngredients([...selectedIngredients, newIngredient]);
};


  const handleQuantityModalCancel = () => {
    setShowQuantityModal(false);
    setSelectedIngredientToAddQuantity(null);
  };

  const handleIngredientRemove = (index) => {
    const updatedIngredients = [...selectedIngredients];
    updatedIngredients.splice(index, 1);
    setSelectedIngredients(updatedIngredients);
  };

  const addPost = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('userId', user.name);
    formData.append('title', title);
    formData.append('description', description);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    const ingredientsData = selectedIngredients.map((ingredient) => ({
      name: ingredient.name,
      quantity: ingredient.quantity,
      unit: ingredient.unit,
    }));

    formData.append('ingredients', JSON.stringify(ingredientsData));

    fetch(`${process.env.REACT_APP_API_URL}/posts/create`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
    })
      .then((res) => {
        if (res.status === 200) {
          Swal.fire({
            title: 'Success',
            icon: 'success',
            text: 'Post has been added successfully',
          });
          navigate('/post');
        } else {
          Swal.fire({
            title: 'Something went wrong',
            icon: 'error',
            text: 'Please try again',
          });
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        Swal.fire({
          title: 'Something went wrong',
          icon: 'error',
          text: 'Please try again',
        });
      });
  };

  return (
    <Container className='mt-5'>
      <Row>
        <Col lg={{ span: 6, offset: 3 }}>
          <Card>
            <Card.Body className="text-center mt-3">
              <h1>Add Post</h1>
              <Form onSubmit={(e) => addPost(e)}>
                <Form.Group className="mb-3" controlId="form.Name">
                  <Form.Label className="text-center">User</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={user ? user.name : ''}
                    value={user ? user.name : ''}
                    readOnly
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="text-center" controlId="form.Title">
                    Title
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Title"
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="form.Textarea">
                  <Form.Label className="text-center">Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Description"
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                    required
                  />
                  <Form.Group className="mb-3" controlId="form.Image">
                    <Form.Label className="text-center">Image</Form.Label>
                    <Form.Control
                      type="file"
                      onChange={(e) => handleImageChange(e)}
                      accept="image/*"
                    />
                  </Form.Group>
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
                        {`${ingredient.name}: ${ingredient.quantity} ${ingredient.unit}`}
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
                <div className="d-flex justify-content-between">
                  <Button variant="primary" onClick={handleBackClick}>
                    Back
                  </Button>
                  <Button variant="primary" type="submit">
                    Post
                  </Button>
                </div>

              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Modal show={showQuantityModal} onHide={handleQuantityModalCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Add Ingredient Quantity</Modal.Title>
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
          <Button variant="primary" onClick={() => handleQuantityModalAdd(quantityInput, unit)}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}