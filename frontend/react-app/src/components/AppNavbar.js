import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import UserContext from '../UserContext';

import { useState, useEffect, useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

export default function AppNavbar() {

  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  
    return (
      <Navbar expand="lg" className="navbar-dark bg-dark">
        <Navbar.Brand as={Link} to="/" className="mx-5">Virtual Recipe Analyzer</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link as={NavLink} to="/">Home</Nav.Link>
            <Nav.Link as={NavLink} to="/recipes">Recipes</Nav.Link>
           
            {
              user.id ?
              <>
              {user.isAdmin && <Nav.Link as={NavLink} to="/admin">Admin</Nav.Link>}
              <Nav.Link as={NavLink} to="/logout">Logout</Nav.Link>
              </>
              :
              <>
              <Nav.Link as={NavLink} to="/login">Login</Nav.Link>
              <Nav.Link as={NavLink} to="/register">Register</Nav.Link>
              </>
            }
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
};
