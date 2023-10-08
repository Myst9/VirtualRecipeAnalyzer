const Post = require("../models/Post");

module.exports.addPost = (data) => {

	
		let newPost = new Post({
			userId: data.post.name,
			title: data.post.title,
			ingredients: data.post.ingredients,
			description: data.post.description
			
		});

		return newPost.save().then((post, error) => {

			if(error){
				return false;
			} else {
				return true;
			}
		})
	

	
};

module.exports.getAllPosts = () => {
	return Post.find({}).then(result => {
		return result;
	});
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
          // Post with the given ID was not found.
          return false;
        }
        // Post deleted successfully.
        return true;
      })
      .catch((error) => {
        console.error(error);
        return false; // An error occurred during the deletion.
      });
  

  };

