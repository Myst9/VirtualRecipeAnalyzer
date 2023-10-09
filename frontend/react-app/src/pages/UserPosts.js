import { Table } from 'react-bootstrap';
import PostCard from '../components/PostCard';
import { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';



export default function UserPosts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/posts/all-posts`)
      .then(res => res.json())
      .then(data => {
        console.log(data);

        setPosts(data.map(post => {
          return (
            <PostCard key={post._id} post={post} />
          )
        }))
      })
    }, [])

  return (
    <>
    {posts}
    </>
  );
  
}
