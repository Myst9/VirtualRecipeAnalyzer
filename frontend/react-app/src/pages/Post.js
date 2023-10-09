import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Button } from 'react-bootstrap';
import UserPosts from './UserPosts';
import UserContext from '../UserContext';
import { useNavigate } from 'react-router-dom';

export default function Post() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  return (
    <>
      <Container className="d-flex justify-content-center">
        <div>
          <h2 className="text-center">Posts Page</h2>
          <Container className="d-flex justify-content-center">
            {user.id ? (
              <Button variant="primary" as={Link} to="/addPost">
                Post a Recipe
              </Button>
            ) : (
              <Button variant="primary" as={Link} to="/login">
                Log In Post
              </Button>
            )}
          </Container>
        </div>
      </Container>
      <Row className="mt-3 mb-3">
        <UserPosts />
      </Row>
    </>
  );
}
