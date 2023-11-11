import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
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
  const postIds = queryParams.get('postIds').split(',');

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetchedPosts = await Promise.all(postIds.map((postId) => fetchPostById(postId)));
        setPosts(fetchedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, [postIds]);

  const groupedPosts = [];
  for (let i = 0; i < posts.length; i += 3) {
    groupedPosts.push(posts.slice(i, i + 3));
  }

  return (
    <Container>
      <h2>Similar Recipes</h2>
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
