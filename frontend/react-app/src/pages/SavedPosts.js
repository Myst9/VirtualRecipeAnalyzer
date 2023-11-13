import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import PostCard from '../components/PostCard';
import UserContext from '../UserContext';

const fetchSavedPosts = async (token) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/users/getSavedPosts`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch saved posts');
    }

    const data = await response.json();

    // If the response is an array, return it directly
    if (Array.isArray(data)) {
      return data;
    }

    // If the response is an object with a 'savedPosts' property, extract and return it
    if (data.hasOwnProperty('savedPosts') && Array.isArray(data.savedPosts)) {
      return data.savedPosts;
    }

    return [];
  } catch (error) {
    console.error('Error fetching saved posts:', error);
    throw error;
  }
};


const SavedPosts = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [savedPosts, setSavedPosts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    const fetchPosts = async () => {
      try {
        const fetchedSavedPosts = await fetchSavedPosts(token);
        
        setSavedPosts(fetchedSavedPosts || []);
      } catch (error) {
        console.error('Error fetching saved posts:', error);
      }
    };

    fetchPosts();
  }, [user.id]);

  const handleBookmarkClick = (postId) => {
    // Remove the post with the specified postId from the saved posts list
    setSavedPosts((prevSavedPosts) => prevSavedPosts.filter((post) => post._id !== postId));
  };

  const groupedPosts = [];
  for (let i = 0; i < savedPosts.length; i += 3) {
    groupedPosts.push(savedPosts.slice(i, i + 3));
  }

  return (
    <Container className="mt-5">
      {savedPosts.length === 0 ? (
        <Container style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '70vh' }}>
          <h2 style={{ color: 'white' }}>No saved recipes found</h2>
          <Button onClick={() => navigate(-1)} style={{ padding: '10px', backgroundColor: '#eb3464', color: 'white' }}>Go Back</Button>
        </Container>
      ) : (
        <>
          <h2 className="text-center mb-5 pt-5" style={{ color: 'white' }}>Saved Recipes</h2>
          {groupedPosts.map((row, rowIndex) => (
            <Row key={rowIndex} className="mb-3">
              {row.map(post => (
                <Col key={post._id} lg={4}>
                  <PostCard post={post} isBookmarked={true} onBookmarkClick={handleBookmarkClick}/>
                </Col>
              ))}
            </Row>
          ))}
        </>
      )}
    </Container>
  );
};

export default SavedPosts;
