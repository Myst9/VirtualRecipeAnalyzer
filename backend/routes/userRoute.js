const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../auth");

// Routes for checking if the email already exists in the database
router.post("/checkEmail", (req,res) => {
	userController.checkEmailExists(req.body).then(resultFromController => res.send(resultFromController));
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


module.exports = router;