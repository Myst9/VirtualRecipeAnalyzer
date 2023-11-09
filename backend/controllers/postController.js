const Post = require("../models/Post");

module.exports.addPost = async (data) => {
  try {
    const { userId, title, ingredients, description, image } = data;

    console.log(ingredients);

    let newPost = new Post({
      userId,
      title,
      ingredients, 
      description,
      image: {
        data: image.data, 
        contentType: image.contentType, 
      },
    });

    const savedPost = await newPost.save();
    return savedPost;
  } catch (error) {
    console.error(error);
    throw error; 
  }
};


module.exports.getAllPosts = () => {
	return Post.find({}).then(result => {
		return result;
	});
};

module.exports.getPost = async (postId) => {
  return Post.findById(postId).then(result => {
  	return result;
  })
};


module.exports.updatePost = (data, reqParams, reqBody) => {
	
		let updatedPost = {
	
			description: reqBody.description,
			
		};

		return Post.findByIdAndUpdate(reqParams.postId, updatedPost).then((post, error) => {
			if(error){
				return false;
			} else {
				return true;
			};
		});
};

module.exports.deletePost = (data, reqParams) => {
  
    return Post.findByIdAndDelete(reqParams.postId)
      .then((post) => {
        if (!post) {
          return false;
        }
        return true;
      })
      .catch((error) => {
        console.error(error);
        return false; 
      });
  

  };

  // Function to like a post
module.exports.likePost = async (postId) => {
  try {
    const post = await Post.findById(postId);

    if (!post) {
      throw new Error("Post not found");
    }

    post.likes += 1;
    return post.save();
  } catch (error) {
    throw error;
  }
};

// Function to dislike a post
module.exports.dislikePost = async (postId) => {
  try {
    const post = await Post.findById(postId);

    if (!post) {
      throw new Error("Post not found");
    }

    post.dislikes += 1;
    return post.save();
  } catch (error) {
    throw error;
  }
};

// Function to get like counts for a post
module.exports.getLikeCounts = async (postId) => {
  try {
    const post = await Post.findById(postId);

    if (!post) {
      throw new Error("Post not found");
    }

    return  post.likes;

  } catch (error) {
    throw error;
  }
};