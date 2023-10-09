import { Card, Button, Col, Row } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function PostCard({post}) {

const { userId, title, description, _id } = post;

  return (
    <Row className="mt-3 mb-3">
      <Col xs={12}>
        <Card className="cardHighlight p-0">
          <Card.Body>
            <Card.Title><h4>{title}</h4></Card.Title>
            <Card.Subtitle>Description:</Card.Subtitle>
            <Card.Text>{description}</Card.Text>
            <Card.Subtitle>userId:</Card.Subtitle>
            <Card.Text>{userId}</Card.Text>
        </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}