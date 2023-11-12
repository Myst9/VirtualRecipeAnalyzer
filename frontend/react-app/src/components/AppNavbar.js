import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import UserContext from '../UserContext';
import '../App.css';
import { useState, useEffect, useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

export default function AppNavbar() {

  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  
    return (
      <Navbar expand="lg" className="custom-navbar">
        <Navbar.Brand as={Link} to="/" className="mx-5" style={{ color: '#fff' }}>Virtual Recipe Analyzer</Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="custom-toggler" />
        <Navbar.Collapse id="basic-navbar-nav" style={{ color: '#fff' }}>
          <Nav className="mr-auto">
            <Nav.Link as={NavLink} to="/" style={{ color: '#fff' }}>Home</Nav.Link>
            <Nav.Link as={NavLink} to="/recipes" style={{ color: '#fff' }}>Analyze</Nav.Link>
            <Nav.Link as={NavLink} to="/post" style={{ color: '#fff' }}>Recipes</Nav.Link>
            
            {
              user.id ?
              <>
              <Nav.Link as={NavLink} to="/logout" style={{ color: '#fff' }}>Logout</Nav.Link>
              </>
              :
              <>
              <Nav.Link as={NavLink} to="/login" style={{ color: '#fff' }}>Login</Nav.Link>
              <Nav.Link as={NavLink} to="/register" style={{ color: '#fff' }}>Register</Nav.Link>
              </>
            }
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
};
