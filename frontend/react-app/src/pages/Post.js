import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Button, Form } from 'react-bootstrap';
import UserPosts from './UserPosts';
import UserContext from '../UserContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';



export default function Post() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  //Created a state variable for the search query
  const [searchQuery, setSearchQuery] = useState('');

  //Created a handler function to update the search query
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <>
      <Container className="d-flex justify-content-center">
        <div>
          
          <Container className="d-flex justify-content-center mt-4">
            {user.id ? (
              <Button variant="primary" as={Link} to="/addPost">
                Post a Recipe
              </Button>
            ) : (
              <Button variant="primary" as={Link} to="/login">
                Log In To Post
              </Button>
            )}
          </Container>
          {/*Added a search bar */}
          <Container className="d-flex justify-content-center mt-4">
            <Form>
              <Form.Group controlId="search">
                <Form.Control
                  type="text"
                  placeholder="Search for posts..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </Form.Group>
            </Form>
          </Container>
        </div>
      </Container>
      <Row className="mt-4 mb-3">
        <UserPosts searchQuery={searchQuery} />
      </Row>
    </>
  );
}
