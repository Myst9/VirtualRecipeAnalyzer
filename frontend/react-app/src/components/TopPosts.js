import React, { useState, useEffect } from 'react';
import { Card, Container, Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

export default function TopPosts() {
  const [topPosts, setTopPosts] = useState([]);
  const { postId } = useParams();

  const imageUrl = `${process.env.REACT_APP_API_URL}/posts/image/${postId}`;

  useEffect(() => {
    // Fetch the top 3 posts using an API request
    fetch(`${process.env.REACT_APP_API_URL}/posts`, {
      method: 'GET'
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => setTopPosts(data))
      .catch((error) => console.error('Error fetching top posts:', error));
  }, [postId]);

  return (
    <div>
      <Container>
        <Row>
          <Col lg={{ span: 6, offset: 3 }}>
            {topPosts ? (
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
                  <h4 className="text-center mb-4">{topPosts.title}</h4>
                  <Card.Subtitle>Posted by:</Card.Subtitle>
                  <Card.Text>{topPosts.userId}</Card.Text>

                  <Card.Subtitle>Ingredients:</Card.Subtitle>
                  <ul>
                    {topPosts.ingredients ? (
                      topPosts.ingredients.map((ingredient, index) => (
                        <li key={index}>
                          {ingredient.name}: {ingredient.quantity} grams
                        </li>
                      ))
                    ) : (
                      <li>No ingredients available</li>
                    )}
                  </ul>

                  <Card.Subtitle>Description:</Card.Subtitle>
                  <Card.Text>{topPosts.description}</Card.Text>
                </Card.Body>
              </Card>
            ) : (
              <p>Loading topPosts details...</p>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}


