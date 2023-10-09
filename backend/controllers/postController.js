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

