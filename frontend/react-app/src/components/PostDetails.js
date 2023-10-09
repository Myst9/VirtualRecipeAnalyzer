import React, { useState, useEffect } from 'react';
import { Card, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';

export default function PostDetails() {
  const [post, setPost] = useState(null);
  const { postId } = useParams();
  const navigate = useNavigate(); 

  const imageUrl = `${process.env.REACT_APP_API_URL}/posts/image/${postId}`;

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
      .then((data) => setPost(data))
      .catch((error) => console.error('Error fetching post:', error));
  }, [postId]);

  const handleBackClick = () => {
    navigate(-1); 
  };

  return (
    <div>
      <Container>
        <Row>
          <Col lg={{ span: 6, offset: 3 }}>
            {post ? (
              <Card className="cardHighlight p-0">
                <Card.Body>
                  {imageUrl && (
                    <div>
                      <img
                        src={imageUrl}
                        alt="Post Image"
                        style={{ maxWidth: '100%', maxHeight: '100%' }}
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
                          {ingredient.name}: {ingredient.quantity} grams
                        </li>
                      ))
                    ) : (
                      <li>No ingredients available</li>
                    )}
                  </ul>

                  <Card.Subtitle>Description:</Card.Subtitle>
                  <Card.Text>{post.description}</Card.Text>

                  <Button variant="primary" onClick={handleBackClick}>
                    Back
                  </Button>
                </Card.Body>
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
