import Banner from '../components/Banner';
import { Link } from 'react-router-dom';
import { Button, Row, Col, Container } from 'react-bootstrap';
import PostCard from '../components/PostCard';
import React, { useState, useEffect } from 'react';

import '../App.css';

export default function Home() {
  const data = {
    title: "Virtual Recipe Analyzer",
    content: "Discover new Recipes",
    destination: "/recipes",
    label: "Analyze Now!"
  };

  useEffect(() => {
    document.body.style.backgroundImage = `url(/brooke-lark-6.jpg)`;

    return () => {
      document.body.style.backgroundImage = null;
    };
  }, []);

  const [limitedPosts, setLimitedPosts] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/posts/all-posts`)
      .then(res => res.json())
      .then(data => {
        // Limit the posts to the first three
        const firstThreePosts = data.slice(0, 3);
        setLimitedPosts(firstThreePosts);
      });
  }, []);

  return (
    <div className="pageContainer">
      <Banner data={data} />
      
      <div style={{ display: 'flex', alignItems: 'center', marginLeft: '35px' }}>
        <h1 style={{ color: 'white' }}>Discover Trending Recipes</h1>
        <div style={{ marginLeft: 'auto' }}>
          <Link to="/post" className="arrow-link">
            <span style={{ fontSize: '15px' }}>Discover more</span>
            <span className="arrow-icon">→</span>
          </Link>
        </div>
      </div>

      <Container>
        <Row className="mb-3">
          {limitedPosts.map(post => (
            <Col key={post._id} lg={4}>
              <PostCard post={post} />
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}
