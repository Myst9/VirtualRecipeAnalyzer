import { Table } from 'react-bootstrap';
import PostCard from '../components/PostCard';
import { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function UserPosts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/posts/all-posts`)
      .then(res => res.json())
      .then(data => {
        console.log(data);

        setPosts(data);
      });
  }, []);

  const groupedPosts = [];
  for (let i = 0; i < posts.length; i += 3) {
    groupedPosts.push(posts.slice(i, i + 3));
  }

  return (
    <Container>
      {groupedPosts.map((row, rowIndex) => (
        <Row key={rowIndex} className="mb-3">
          {row.map(post => (
            <Col key={post._id} lg={4}>
              <PostCard post={post} />
            </Col>
          ))}
        </Row>
      ))}
    </Container>
  );
}
