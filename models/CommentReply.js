const mongoose = require("mongoose")
const {
	Schema,
	model
} = mongoose

const commentReplySchema = new Schema({
	comment: {
		type: Schema.Types.ObjectId,
		ref: "Comment"
	},
	body: {
		type: String,
		trim: true
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: "Customer"
	},
	like: Number,
	dislike: Number
}, {
	timestamps: true
});

const CommentReply = model("CommentReply", commentReplySchema);

module.exports = CommentReply;