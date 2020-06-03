const mongoose = require("mongoose")
const {
	Schema,
	model
} = mongoose

const productCollectionSchema = new Schema({
	name: {
		type: String,
		trim: true
	},
	title: {
		type: String,
		trim: true
	},
	description: {
		type: String,
		trim: true
	},
	products: [{
		type: Schema.Types.ObjectId,
		ref: "Product"
	}]
}, {
	timestamps: true
});

const ProductCollection = model(
	"ProductCollection",
	productCollectionSchema
);

module.exports = ProductCollection;