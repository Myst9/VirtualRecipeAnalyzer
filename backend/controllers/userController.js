const User = require("../models/User");
const Course = require("../models/Recipe");
const bcrypt = require("bcrypt");
const auth = require("../auth");
const Post = require("../models/Post");
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

module.exports.checkNameExists = (reqBody) => {
	
	return User.find({ name: reqBody.name }).then(result => {

		if(result.length > 0){
			
			return true
		
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

module.exports.bookmarkPost = async (data) => {
  try {
    const { userId, postId, remove } = data;

    const updateOperation = remove ? '$pull' : '$addToSet';
    const updateQuery = { [updateOperation]: { savedPosts: postId } };

    const result = await User.findByIdAndUpdate(userId, updateQuery, { new: true });

    if (!result) {
      return false; // User not found or other error
    }

    result.password = '';
    return result;
  } catch (error) {
    console.error('Bookmark post error:', error);
    throw error;
  }
};

module.exports.removeSavedPost = async (data) => {
  try {
    const { userId, postId } = data;

    const result = await User.findByIdAndUpdate(userId, { $pull: { savedPosts: postId } }, { new: true });

    if (!result) {
      return false; // User not found or other error
    }

    result.password = '';
    return result;
  } catch (error) {
    console.error('Remove saved post error:', error);
    throw error;
  }
};

module.exports.likePost = async (data) => {
	try {
	  const { userId, postId, remove } = data;
  
	  const updateOperation = remove ? '$pull' : '$addToSet';
	  const updateQuery = { [updateOperation]: { likes: postId } };
  
	  const result = await User.findByIdAndUpdate(userId, updateQuery, { new: true });
  
	  if (!result) {
		return false; // User not found or other error
	  }
  
	  result.password = '';

	  const post = await Post.findById(postId);
	  if(!post) {
		return false;
	  }
	  if(remove){
		post.likes -= 1;
	  } else {
		post.likes += 1;
	  }
	  await post.save();
	  return true;
	} catch (error) {
	  console.error('Like post error:', error);
	  throw error;
	}
  };
  
  module.exports.removeLikedPost = async (data) => {
	try {
	  const { userId, postId } = data;
  
	  const result = await User.findByIdAndUpdate(userId, { $pull: { likes: postId } }, { new: true });
  
	  if (!result) {
		return false; // User not found or other error
	  }
  
	  result.password = '';
	  const post = await Post.findById(postId);
	  if(!post) {
		return false;
	  }
	  post.likes -= 1;

	  await post.save();
	  return true;
	} catch (error) {
	  console.error('Remove liked post error:', error);
	  throw error;
	}
  };
