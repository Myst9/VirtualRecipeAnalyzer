const jwt = require("jsonwebtoken");

const secret = "VirtualRecipeLabAPI";

module.exports.createAccessToken = (user) => {

	const data = {
		id: user._id,
		email: user.email,
		isAdmin: user.isAdmin
	};

	// Generate a JSON web token using the jwt's sign method
	// Generate the token using the form data and the secret code with no additional options provided
	return jwt.sign(data, secret, {});
};

// Token Verification

module.exports.verify = (req, res, next) => {
	let token = req.headers.authorization

	if(typeof token!== "undefined"){
		token = token.slice(7, token.length);
		return jwt.verify(token, secret, (err, data) => {
			if(err){
				return res.send({ auth: "failed" });
			} else {
				// Allows the application to proceed with the next middleware function/callback function in the route
				next()
			}
		})
	} else {
		return res.send({ auth: "failed" });
	};
};

//Token Decryption

module.exports.decode = (token) => {

	if(typeof token !== "undefined"){
		token = token.slice(7, token.length);
		return jwt.verify(token, secret, (err, data) => {
			if(err){
				return null;
			} else {
				// The "decode" method is used to obtain the information from the JWT
				return jwt.decode(token, { complete: true }).payload;
			};
		})
	} else {
		return null;
	}
}