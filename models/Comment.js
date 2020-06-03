const mongoose = require("mongoose")
const {
	Schema,
	model
} = mongoose

const commentSchema = new Schema({
	product: {
		type: Schema.Types.ObjectId,
		ref: "Product"
	},
	body: {
		type: String,
		trim: true
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: "Customer"
	},
	reply: [{
		type: Schema.Types.ObjectId,
		ref: "CommentReply"
	}],
	like: Number,
	dislike: Number
}, {
	timestamps: true
});

const Comment = model("Comment", commentSchema);

module.exports = Comment;