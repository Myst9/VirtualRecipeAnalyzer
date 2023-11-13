import React, { useState, useEffect, useContext, useRef } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import UserContext from '../UserContext';

import '../App.css';

export default function AppNavbar() {
  const { user } = useContext(UserContext);
  const [showProfile, setShowProfile] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const navigate = useNavigate();
  const profileRef = useRef();

  useEffect(() => {
    // Make a request to your backend to get the user's information
    if (user.id) {
      fetch(`${process.env.REACT_APP_API_URL}/users/details`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then((response) => response.json())
        .then((userData) => {
          setUserDetails(userData); // Assuming the server returns an object with 'username' and 'email' properties
          setShowProfile(false);
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
        });
    }
  }, [user.id]);

  const handleProfileClick = () => {
    setShowProfile(!showProfile);
    
    
  };

  const handleClickOutsideProfile = (event) => {
    if (profileRef.current && !profileRef.current.contains(event.target)) {
      setShowProfile(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutsideProfile);

    return () => {
      document.removeEventListener('click', handleClickOutsideProfile);
    };
  }, []);

  const handleViewSavedPosts = () => {
    // Navigate to the SavedPosts page when the button is clicked
    navigate('/saved-posts');
  };

  return (
    <Navbar expand="lg" className="custom-navbar fixed-top">
      <Navbar.Brand as={Link} to="/" className="mx-5" style={{ color: '#fff' }}>
        <img src="/cooking.png" alt="Icon" width="30" height="30" />
      </Navbar.Brand>

      <Navbar.Toggle aria-controls="basic-navbar-nav" className="custom-toggler" />
      <Navbar.Collapse id="basic-navbar-nav" style={{ color: '#fff' }}>
        <Nav className="mr-auto">
          <Nav.Link as={NavLink} to="/" style={{ color: '#fff' }} activeClassName="active">
            Home
          </Nav.Link>
          <Nav.Link as={NavLink} to="/recipes" style={{ color: '#fff' }} activeClassName="active">
            Analyze
          </Nav.Link>
          <Nav.Link as={NavLink} to="/post" style={{ color: '#fff' }} activeClassName="active">
            Recipes
          </Nav.Link>
        </Nav>
        <Nav className="ms-auto">
          {user.id ? (
            <div className="profile-icon-container" ref={profileRef}>
              <FaUser
                onClick={handleProfileClick}
                className="profile-icon"
                style={{ marginRight: '1rem', cursor: 'pointer' }}
              />
              {showProfile && (
                <div className="profile-options">
                  <p>{userDetails?.name}</p>
                  <p>
                    <strong>Email:</strong> {userDetails?.email}
                  </p>
                  <button className="view-saved-posts" onClick={handleViewSavedPosts}>
                    Saved Recipes
                  </button>
                  <button className="logout" onClick={() => navigate('/logout')}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Nav.Link as={NavLink} to="/login" style={{ color: '#fff' }} activeClassName="active">
                Login
              </Nav.Link>
              <Nav.Link as={NavLink} to="/register" style={{ color: '#fff' }} activeClassName="active">
                Register
              </Nav.Link>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
