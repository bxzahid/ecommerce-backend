const mongoose = require("mongoose")
const {
	Schema,
	model
} = mongoose

const cartSchema = new Schema({
	customer: {
		type: Schema.Types.ObjectId,
		ref: "Customer"
	},
	listOfProducts: [Object],
	subTotal: Number,
	discount: Number,
	shippingCharge: Number,
	payableAmount: Number
}, {
	timestamps: true
});

const Cart = model("Cart", cartSchema);

module.exports = Cart;