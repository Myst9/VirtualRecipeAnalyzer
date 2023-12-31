const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const auth = require("../auth");
const multer = require("multer");
const Post = require("../models/Post");
const mongoose = require('mongoose');


const storage = multer.memoryStorage(); 
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, 
});

router.post("/create", auth.verify, upload.single("image"), async (req, res) => {
  try {
    const { userId, title, description } = req.body;

    
    const image = req.file;

    const ingredients = JSON.parse(req.body.ingredients);

    const data = {
      userId,
      title,
      description,
      image: {
        data: image.buffer, 
        contentType: image.mimetype, 
      },
      ingredients
    };

    const resultFromController = await postController.addPost(data);
    res.json(resultFromController);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/image/:postId", async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);

    if (!post || !post.image) {
      return res.status(404).json({ error: "Image not found" });
    }

    res.set("Content-Type", post.image.contentType);
    res.send(post.image.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/all-posts", (req, res) => {
	postController.getAllPosts().then(resultFromController => res.send(
		resultFromController));
});

router.put("/:postId",(req, res) => {
  postController.updatePost(req.params, req.body).then(resultFromController => res.send(
    resultFromController));
});

router.post("/:postId", (req, res) => {
	//data = auth.decode(req.headers.authorization);
	postController.deletePost(req.params).then(resultFromController => res.send(
		resultFromController));
});

router.get("/:postId", async (req, res) => {
  const postId = req.params.postId;

console.log(mongoose.Types.ObjectId.isValid(postId));
console.log(postId);
  
  if (!postId) {
    return res.status(400).send("Invalid postId");
  }

  postController.getPost(postId).then(resultFromController => {
    if (!resultFromController) {
      return res.status(404).send("Post not found");
    }
    res.send(resultFromController);
  }).catch(err => {
    console.error(err);
    res.status(500).send("Internal server error");
  });
});

// Route to like a post
router.post("/like/:postId", async (req, res) => {
  const postId = req.params.postId;

  try {
    const updatedPost = await postController.likePost(postId);
    const likeCounts = await postController.getLikeCounts(postId);

    res.json({
      post: updatedPost,
      likeCounts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to dislike a post
router.post("/dislike/:postId", async (req, res) => {
  const postId = req.params.postId;

  try {
    const updatedPost = await postController.dislikePost(postId);
    //const likeCounts = await postController.getLikeCounts(postId);

    res.json({
      post: updatedPost,
      //likeCounts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to get like counts for a post
/*router.get("/likeCounts/:postId", async (req, res) => {
  const postId = req.params.postId;

  try {
    const likeCounts = await postController.getLikeCounts(postId);

    res.json({ likes: likeCounts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});*/

module.exports = router;