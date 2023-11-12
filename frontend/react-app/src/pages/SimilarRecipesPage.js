import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import PostCard from '../components/PostCard';

const fetchPostById = async (postId) => {
  try {
    const response = await fetch(`http://localhost:4000/posts/${postId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch post');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching post with ID ${postId}:`, error);
    throw error;
  }
};

const SimilarRecipes = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const postIds = queryParams.get('postIds');

  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!postIds) {
      // No post IDs in the query, handle accordingly
      return;
    }

    const fetchPosts = async () => {
      try {
        const fetchedPosts = await Promise.all(postIds.split(',').map((postId) => fetchPostById(postId)));
        setPosts(fetchedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, [postIds]);

  if (!postIds) {
    return (
      <Container style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '70vh' }}>
        <h2 style={{ color: 'white' }}>No recipes found with given ingredients</h2>
        <Button onClick={() => navigate(-1)} style={{ padding: '10px', backgroundColor: '#eb3464', color: 'white' }}>Go Back</Button>
      </Container>

    );
  }

  const groupedPosts = [];
  for (let i = 0; i < posts.length; i += 3) {
    groupedPosts.push(posts.slice(i, i + 3));
  }

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-5" style={{ color: 'white' }}>Similar Recipes</h2>
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
};

export default SimilarRecipes;
