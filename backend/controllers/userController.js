const User = require("../models/User");
const Course = require("../models/Recipe");
const bcrypt = require("bcrypt");
const auth = require("../auth");

module.exports.checkEmailExists = (reqBody) => {
	
	return User.find({ email: reqBody.email }).then(result => {

		if(result.length > 0){
			
			return true
		
		// No duplicate email found
		// The user is not yet registered in the database
		} else {
			
			return false
		
		}
	})
}

module.exports.registerUser = (reqBody) => {

	let newUser = new User({
		name: reqBody.name,
		email: reqBody.email,
		password: bcrypt.hashSync(reqBody.password, 10)
	})

	return newUser.save().then((user, error) => {

		if(error){
			return false
		} else {
			return true
		}
	})
}

module.exports.loginUser = (reqBody) => {

	return User.findOne({ email: reqBody.email }).then(result => {

		// Email doesn't exist
		if(result == null){

			return false;

		} else {

			const isPasswordCorrect = bcrypt.compareSync(reqBody.password, result.password);

			// Correct password
			if(isPasswordCorrect){

				return { access: auth.createAccessToken(result) }

			// Password incorrect	
			} else {

				return false;
				
			}

		}
	});
}

module.exports.getProfile = (data) => {
	console.log(data);
	return User.findOne({ _id: data.userId}).then(result => {
		if(result == null){
			return false
		} else {
			result.password = "";
			return result;
		}
	})
}
