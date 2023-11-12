import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import UserContext from '../UserContext';
import '../App.css';
import React, { useState, useEffect, useContext } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Logout from '../pages/Logout';
import { FaUser } from 'react-icons/fa';

export default function AppNavbar() {

  const { user } = useContext(UserContext);
  const [showProfile, setShowProfile] = useState(false);
  const [userDetails, setUser] = useState(null);
  const navigate = useNavigate();

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
        setUser(userData); // Assuming the server returns an object with 'username' and 'email' properties
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  }
}, [user.id]);


  const handleProfileClick = () => {
    setShowProfile(!showProfile);
  };


    return (
      <Navbar expand="lg" className="custom-navbar">
        <Navbar.Brand as={Link} to="/" className="mx-5" style={{ color: '#fff' }}>Virtual Recipe Analyzer</Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="custom-toggler" />
        <Navbar.Collapse id="basic-navbar-nav" style={{ color: '#fff' }}>
          <Nav className="mr-auto">
            <Nav.Link as={NavLink} to="/" style={{ color: '#fff' }}>Home</Nav.Link>
            <Nav.Link as={NavLink} to="/recipes" style={{ color: '#fff' }}>Recipes</Nav.Link>
            <Nav.Link as={NavLink} to="/post" style={{ color: '#fff' }}>Posts</Nav.Link>
          </Nav>
          <Nav className="ml-auto">

            {
              user.id ?(
                <div className="profile-icon-container">
                  <FaUser onClick={handleProfileClick} className="profile-icon" />
                  {showProfile && (
                      <div className="profile-options">
                      <p>{userDetails?.name}</p>
                      <p><strong>Email:</strong> {userDetails?.email}</p>
                      <button className="view-saved-posts" onClick={() => console.log('View Saved Posts')}>
                        Saved Posts
                      </button>
                      <button className="logout" onClick={() => navigate('/logout')}>
                        Logout
                      </button>
                      </div>
                      )
                  }
                </div>
                
              )
              : (
              <>
              <Nav.Link as={NavLink} to="/login" style={{ color: '#fff' }}>Login</Nav.Link>
              <Nav.Link as={NavLink} to="/register" style={{ color: '#fff' }}>Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
};
             