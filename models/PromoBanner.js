const mongoose = require("mongoose")
const {
	Schema,
	model
} = mongoose

const promoBannerSchema = new Schema({
	title: {
		type: String,
		trim: true
	},
	slug: {
		type: String,
		trim: true
	},
	body: {
		type: String,
		trim: true
	},
	image: String
}, {
	timestamps: true
});

const PromoBanner = model("PromoBanner", promoBannerSchema);

module.exports = PromoBanner;