import React, { useState } from 'react';
import Swal from 'sweetalert2';

const CommentForm = ({ postId, user, setComments }) => {
  const [commentText, setCommentText] = useState('');

  const handleCommentSubmit = () => {
    // Make a request to add a new comment
    fetch(`${process.env.REACT_APP_API_URL}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        postId,
        userId: user.name, // Use the current user's ID or name
        text: commentText,
      }),
    })
      .then((response) => response.json())
      .then((newComment) => {
        // Update the local state with the new comment
        setComments((prevComments) => [newComment, ...prevComments]);
        setCommentText(''); // Clear the comment text input
        Swal.fire({
          icon: 'success',
          title: 'Comment Added',
          text: 'Your comment has been successfully added!',
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred while adding the comment.',
        });
        console.error('Error adding comment:', error);
      });
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px', margin: '10px' }}>
      <textarea
        style={{
          gridColumn: 'span 5',
          resize: 'vertical',
          padding: '10px',
          borderRadius: '5px',
          border: '1px solid #ccc',
        }}
        placeholder="Add a comment..."
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
      />
      <button
        style={{
          gridColumn: 'span 1',
          padding: '10px',
          borderRadius: '5px',
          background: '#4CAF50',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
        }}
        onClick={handleCommentSubmit}
      >
        Add Comment
      </button>
    </div>
  );
};

export default CommentForm;