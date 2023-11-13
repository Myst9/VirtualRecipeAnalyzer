const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');

router.get('/:postId', async (req, res) => {
  const postId = req.params.postId;

  try {
    const comments = await Comment.find({ postId }).sort({ createdOn: -1 });
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/', async (req, res) => {
  const { postId, userId, text } = req.body;

  try {
    const newComment = await Comment.create({
      postId,
      userId,
      text,
    });

    res.status(201).json(newComment);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;