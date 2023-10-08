const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const auth = require("../auth");

router.post("/create", auth.verify, (req, res) => {

	const data = {
		post: req.body,
		
	};
	postController.addPost(data).then(resultFromController => res.send(
		resultFromController));
});

router.get("/all-posts", (req, res) => {
	postController.getAllPosts().then(resultFromController => res.send(
		resultFromController));
});

router.put("/:postId/delete", auth.verify, (req, res) => {
	//data = auth.decode(req.headers.authorization);
	postController.deletePost(data, req.params).then(resultFromController => res.send(
		resultFromController));
});


module.exports = router;