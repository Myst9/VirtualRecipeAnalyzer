import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Container, Button, Toast } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark as solidBookmark, faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as regularBookmark, faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';

export default function PostCard({ post}) {
  const { userId, title, _id } = post;

  const imageUrl = `${process.env.REACT_APP_API_URL}/posts/image/${_id}`;
  const postUrl = `/posts/${_id}`;

  const [bookmarkStatus, setBookmarkStatus] = useState(false); // Initialize as false by default
  const [likeStatus, setLikeStatus] = useState(false); 
  const [likeCount, setLikeCount] = useState(post.likes[0] ? post.likes[0].count : 0);


  // State for showing the notification
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const fetchSavedPosts = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/users/getSavedPosts`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const savedPosts = await response.json();
        console.log('Saved Posts:', savedPosts); // Log the saved posts to the console

        // Check if the current post is in the savedPosts list
        const isPostSaved = savedPosts.some(savedPost => savedPost._id === _id);

        // Update state with the new bookmark status
        setBookmarkStatus(isPostSaved);
      } catch (error) {
        console.error('Error fetching saved posts:', error);
      }
    };

    fetchSavedPosts();
  }, [userId, _id]);

  useEffect(() => {
    const fetchLikedPosts = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/users/getLikedPosts`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
  
        const likes = await response.json();
        console.log('Liked Posts:', likes); // Log the liked posts to the console
  
        // Check if the current post is in the likedPosts list
        const isPostLiked = likes.some((likedPost) => likedPost._id === _id);
  
        // Update state with the new like status
        setLikeStatus(isPostLiked);
      } catch (error) {
        console.error('Error fetching liked posts:', error);
      }
    };
  
    fetchLikedPosts();
  }, [userId, _id]);
  

  const handleBookmarkClick = async (event) => {
    event.stopPropagation();
    console.log('Bookmark button clicked');
    try {
      const endpoint = bookmarkStatus ? 'removeSavedPost' : 'bookmark';
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          postId: _id,
        }),
      });

      const data = await response.json();
      console.log('Bookmark request successful:', data);

      if (data) {
        // Update state with the new bookmark status
        setBookmarkStatus(!bookmarkStatus);
        setShowNotification(true);
      }
    } catch (error) {
      console.error('Bookmark request failed:', error);
    }
  };

  const handleLikeClick = async (event) => {
    event.stopPropagation();
    console.log('Like button clicked');
    try {
      const endpoint = likeStatus ? 'removeLikedPost' : 'like'; // Update endpoint for liking

      const response = await fetch(`${process.env.REACT_APP_API_URL}/users/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          postId: _id,
        }),
      });

      const data = await response.json();
      console.log('Like request successful:', data);

      if (data) {
        // Update state with the new like status
        setLikeStatus(!likeStatus);
        setLikeCount(data.likes.length);
        setShowNotification(true);
      }
    } catch (error) {
      console.error('Like request failed:', error);
    }
  };


  return (
    <Container>
      <Row>
        <Col lg={12}>
          {/* Use a div as the clickable area, excluding the bookmark button */}
          <div className="rounded overflow-hidden shadow position-relative" onClick={() => window.location.href = postUrl}>
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
            <Card className="cardHighlight p-0 border-0">
              <Card.Body style={{ height: '100px' }}>
                {/* Set a fixed height for the card body */}
                <div className="position-absolute top-0 end-0 p-2">
                <Button
                    variant="outline-danger"
                    onClick={handleLikeClick}
                    style={{
                      border: 'none',
                      boxShadow: 'none',
                      backgroundColor: 'transparent',
                    }}
                  >
                    <FontAwesomeIcon
                      icon={likeStatus ? solidHeart : regularHeart}
                      style={{ color: 'red' }}
                    />
                    <span className="ms-1"  style={{ color: 'black'}}>{likeCount}</span>
                  </Button>

                  {/* Bookmark button */}
                  <Button
                    variant="outline-primary"
                    onClick={handleBookmarkClick}
                    style={{
                      border: 'none', // Remove border
                      boxShadow: 'none', // Remove box shadow
                      backgroundColor: 'transparent', // Remove background color
                    }}
                  >
                    <FontAwesomeIcon
                      icon={bookmarkStatus ? solidBookmark : regularBookmark}
                      style={{ color: 'black' }}
                    />
                  </Button>
                </div>
                <Card.Title>
                  <h4 className="text-center">{title}</h4>
                </Card.Title>
                <Card.Subtitle>Posted by:</Card.Subtitle>
                <Card.Text>{userId}</Card.Text>
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>
      {/* Notification Toast */}
      <Toast
        show={showNotification}
        onClose={() => setShowNotification(false)}
        delay={3000}
        autohide
        style={{
          position: 'absolute',
          top: 16,
          right: 16,
        }}
      >
        {/* <Toast.Body>{bookmarkStatus ? 'Recipe saved!' : 'Recipe removed!'}</Toast.Body> */}
      </Toast>
    </Container>
  );
}
