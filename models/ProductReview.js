const mongoose = require("mongoose")
const {
	Schema,
	model
} = mongoose

const productReviewSchema = new Schema({
	like: Number,
	dislike: Number,
	body: {
		type: String,
		trim: true
	},
	rating: Number,
	product: {
		type: Schema.Types.ObjectId,
		ref: "Product"
	},
	reviewer: {
		type: Schema.Types.ObjectId,
		ref: "Customer"
	}
}, {
	timestamps: true
});

const ProductReview = model("ProductReview", productReviewSchema);

module.exports = ProductReview;