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
			},
			unit: {
				type: String,
				default: "g"
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
	},
	image: {
		data: Buffer, 
		contentType: String 
	},
	likes: {
	    type: Number,
	    default: 0 // Initial like count
    },
});


module.exports = mongoose.model("Post", postSchema);