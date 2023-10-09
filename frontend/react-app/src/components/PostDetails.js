import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';

export default function PostDetails() {
  const [post, setPost] = useState(null);
  const { postId } = useParams();

  const imageUrl = `${process.env.REACT_APP_API_URL}/posts/image/${postId}`;

  useEffect(() => {
    // Fetch the post details using an API request
    fetch(`${process.env.REACT_APP_API_URL}/posts/${postId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
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
                    {post.ingredients.map((ingredient, index) => (
                      <li key={index}>
                        {ingredient.name}: {ingredient.quantity} grams
                      </li>
                    ))}
                  </ul>

                  <Card.Subtitle>Description:</Card.Subtitle>
                  <Card.Text>{post.description}</Card.Text>
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
