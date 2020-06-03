const mongoose = require("mongoose")
const {
	Schema,
	model
} = mongoose

const couponSchema = new Schema({
	name: {
		type: String,
		trim: true
	},
	for: String,
	description: {
		type: String,
		trim: true
	},
	type: String,
	value: Number,
	sales: [{
		order: {
			type: Schema.Types.ObjectId,
			ref: "Order"
		},
		amount: Number,
		discountedAmount: Number
	}]
}, {
	timestamps: true
});

const Coupon = model("Coupon", couponSchema);

module.exports = Coupon;