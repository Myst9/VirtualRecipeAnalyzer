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
	ingredients: [
		{
			name: {
				type: String,
				required: [true, "Name is required."]
			},
			quantity: {
				type: Number,
				required: [true, "Number is required."]
			}
		}
	],
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