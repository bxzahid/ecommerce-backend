const mongoose = require("mongoose")
const {
	Schema,
	model
} = mongoose

const questionSchema = new Schema({
	product: {
		type: Schema.Types.ObjectId,
		ref: Product
	},
	title: {
		type: String,
		trim: true
	},
	body: {
		type: String,
		trim: true
	},
	answer: String
}, {
	timestamps: true
});

const Question = model("Question", questionSchema);

module.exports = Question;