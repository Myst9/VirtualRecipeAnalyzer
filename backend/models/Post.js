const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
	userId: {
		type: String,
		required: [true, "UserId is required."]
	},
	title: {
		type: String,
		required: [true, "Title is required."]
	},
	description: {
		type: String,
		required: [true, "Description is required."]
	},
	createdOn: {
		type: Date,
		default: new Date()
	}
	
})

module.exports = mongoose.model("Post", postSchema);