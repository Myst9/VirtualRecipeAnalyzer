import React, { useContext, useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import PostCard from '../components/PostCard';

export default function UserPosts({ searchQuery }) {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/posts/all-posts`)
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
      });
  }, []);

  // Update filteredPosts whenever the searchQuery changes
  useEffect(() => {
    if (searchQuery) {
      // Filter posts based on the searchQuery
      const lowercaseSearchQuery = searchQuery.toLowerCase();
      const filtered = posts.filter((post) => {
        return post.title.toLowerCase().includes(lowercaseSearchQuery);
      });

      setFilteredPosts(filtered);
    } else {
      // If there's no search query, show all posts
      setFilteredPosts(posts);
    }
  }, [searchQuery, posts]);

  const groupedFilteredPosts = [];
  for (let i = 0; i < filteredPosts.length; i += 3) {
    groupedFilteredPosts.push(filteredPosts.slice(i, i + 3));
  }

  return (
    <Container>
      {groupedFilteredPosts.map((row, rowIndex) => (
        <Row key={rowIndex} className="mb-3">
          {row.map((post) => (
            <Col key={post._id} lg={4}>
              <PostCard post={post} />
            </Col>
          ))}
        </Row>
      ))}
    </Container>
  );
}
