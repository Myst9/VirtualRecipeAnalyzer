const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../auth");
const User = require('../models/User');
// Routes for checking if the email already exists in the database
router.post("/checkEmail", (req,res) => {
	userController.checkEmailExists(req.body).then(resultFromController => res.send(resultFromController));
});
// Routes for checking if the user name already exists in the database
router.post("/checkName", (req,res) => {
	userController.checkNameExists(req.body).then(resultFromController => res.send(resultFromController));
});

// Route for user registration
router.post("/register", (req,res) => {
	userController.registerUser(req.body).then(resultFromController => res.send(resultFromController));
});

// Route for user authentication (login)
router.post("/login", (req,res) => {
	userController.loginUser(req.body).then(resultFromController => res.send(resultFromController));
});

router.get("/details", auth.verify, (req, res) => {
	const userData = auth.decode(req.headers.authorization);
	console.log("This is a user");
	console.log(userData); 
	userController.getProfile({ userId: userData.id }).then(resultFromController => res.send(resultFromController));
});

// Route for bookmarking a post
router.post('/bookmark', auth.verify, (req, res) => {
  const userData = auth.decode(req.headers.authorization);
  const data = {
    userId: userData.id,
    postId: req.body.postId,
  };
  userController.bookmarkPost(data).then((resultFromController) => res.send(resultFromController));
});

// Route for removing a saved post
router.post('/removeSavedPost', auth.verify, (req, res) => {
  const userData = auth.decode(req.headers.authorization);
  const data = {
    userId: userData.id,
    postId: req.body.postId,
  };
  userController.removeSavedPost(data).then((resultFromController) => res.send(resultFromController));
});

// Route for getting saved posts
router.get('/getSavedPosts', auth.verify, async (req, res) => {
  try {
    const userData = auth.decode(req.headers.authorization);
    const user = await User.findById(userData.id).populate('savedPosts');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user.savedPosts);
  } catch (error) {
    console.error('Error fetching saved posts:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;