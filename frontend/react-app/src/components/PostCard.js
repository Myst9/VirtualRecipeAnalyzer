import React from 'react';
import { Card, Col, Row, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
  const { userId, title, description, _id } = post;

  const imageUrl = `${process.env.REACT_APP_API_URL}/posts/image/${_id}`;

  const postUrl = `/posts/${_id}`; 

  return (
    <Container>
      <Row>
        <Col lg={12}>
          <Link to={postUrl} style={{ textDecoration: 'none' }}>
            <Card className="cardHighlight p-0">
              {imageUrl && (
                <div style={{ position: 'relative', paddingTop: '75%' }}>
                  <img
                    src={imageUrl}
                    alt="Post Image"
                    style={{
                      position: 'absolute',
                      top: '0',
                      left: '0',
                      width: '100%',
                      height: '100%',
                    }}
                  />
                </div>
              )}
              <Card.Body style={{ height: '100px' }}>
                {/* Set a fixed height for the card body */}
                <Card.Title>
                  <h4 className="text-center">{title}</h4>
                </Card.Title>
                <Card.Subtitle>Posted by:</Card.Subtitle>
                <Card.Text>{userId}</Card.Text>
              </Card.Body>
            </Card>
          </Link>
        </Col>
      </Row>
    </Container>
  );
}
