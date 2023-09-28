import AppNavbar from './components/AppNavbar';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Error from './pages/Error';
import './App.css';

import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {useParams} from 'react-router-dom';
import { useState, useEffect } from 'react';
import { UserProvider } from './UserContext';
export default function App() {

  const {userId} = useParams();
  
  const [ user, setUser ] = useState({
    id: null
  });

  const unsetUser = () => {
    localStorage.clear();
  };

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/users/details`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(res => res.json())
    .then(data => {
      if(typeof data._id !== 'undefined'){
        setUser({
          id: data._id
        })
      } else {
        setUser({
          id: null
        })
      }
    })
  }, [])

  return (
    // A common pattern in React for the component to return multiple elements
    <>
    <UserProvider value={{ user, setUser, unsetUser }} >
      <Router>
        <AppNavbar />
        <Container>
          <Routes>
            <Route path="/" element={<Home />} />
            
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/logout" element={<Logout />} />
            
            <Route path="/*" element={<Error />} />
          </Routes>
        </Container>
      </Router>
    </UserProvider>
    </>
  );
}