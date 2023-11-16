import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Container, Button, Toast, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark as solidBookmark, faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as regularBookmark, faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import { faShare } from '@fortawesome/free-solid-svg-icons';

export default function PostCard({ post, isBookmarked, onBookmarkClick }) {
  const { userId, title, _id } = post;

  const imageUrl = `${process.env.REACT_APP_API_URL}/posts/image/${_id}`;
  const postUrl = `/posts/${_id}`;

  const [bookmarkStatus, setBookmarkStatus] = useState(false); // Initialize as false by default
  const [likeStatus, setLikeStatus] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);


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

        // Call the onBookmarkClick callback to remove the post from the saved posts page
        if (onBookmarkClick) {
          onBookmarkClick(_id);
        }
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

        // Adjust the like count based on the current like status
        setLikeCount(prevLikeCount => (likeStatus ? prevLikeCount - 1 : prevLikeCount + 1));

        setShowNotification(true);
      }

    } catch (error) {
      console.error('Like request failed:', error);
    }
  };

  const [showShareModal, setShowShareModal] = useState(false);

  const toggleShareModal = (event) => {
    event.stopPropagation();
    setShowShareModal(!showShareModal);
  };

  const sharePost = (platform) => {
    let shareUrl = '';
    let message = `Check out this recipe ${post.title}\n`;

    const postShareUrl = `${window.location.origin}/posts/${_id}`;

    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message + postShareUrl)}`;
        break;
      case 'instagram':
        shareUrl = `https://www.instagram.com/${encodeURIComponent(message + postShareUrl)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message + postShareUrl)}&via=${encodeURIComponent(message)}`;
        break;
      default:
        break;
    }

    window.open(shareUrl, '_blank');
    setShowShareModal(false);
  };



  const handleCloseModal = () => {
 
    setShowShareModal(false);

  };

  return (
    <Container>
      <Row>
        <Col lg={12}>
          <div
            className="rounded overflow-hidden shadow position-relative"
            onClick={() => (window.location.href = postUrl)}
            style={{ cursor: 'pointer' }}
          >
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
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
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
                      <span className="ms-1" style={{ color: 'black' }}>{likeCount}</span>
                    </Button>
                  </div>

                  <div>
                    <Button
                      variant="outline-primary"
                      onClick={handleBookmarkClick}
                      style={{
                        border: 'none',
                        boxShadow: 'none',
                        backgroundColor: 'transparent',
                      }}
                    >
                      <FontAwesomeIcon
                        icon={bookmarkStatus ? solidBookmark : regularBookmark}
                        style={{ color: 'black' }}
                      />
                    </Button>
                  </div>

                  <div>
                    <Button
                      variant="outline-primary"
                      onClick={toggleShareModal}
                      style={{
                        border: 'none',
                        boxShadow: 'none',
                        backgroundColor: 'transparent',
                        marginTop: '10px', 
                      }}
                    >
                      <FontAwesomeIcon icon={faShare} style={{ color: 'black' }} />
                      <span className="ms-1" style={{ color: 'black' }}>Share</span>
                    </Button>
                  </div>

                  <Modal show={showShareModal} onHide={handleCloseModal} centered >
                  <Modal.Header closeButton onClick={(event) => {
  event.stopPropagation();
  setShowShareModal(false);
}}>
  <Modal.Title>Share on</Modal.Title>
</Modal.Header>

                    <Modal.Body>
                      <Container>
                        <Row className="justify-content-around">
                          <Col xs="auto">
                            <Button
                              variant="outline-primary"
                              onClick={() => sharePost('whatsapp')}
                            >
                              WhatsApp
                            </Button>
                          </Col>
                          <Col xs="auto">
                            <Button
                              variant="outline-primary"
                              onClick={() => sharePost('instagram')}
                            >
                              Instagram
                            </Button>
                          </Col>
                          <Col xs="auto">
                            <Button
                              variant="outline-primary"
                              onClick={() => sharePost('twitter')}
                            >
                              Twitter
                            </Button>
                          </Col>
                        </Row>
                      </Container>
                    </Modal.Body>

                  </Modal>

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
    </Container>
  );
}