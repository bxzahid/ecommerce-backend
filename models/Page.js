const mongoose = require("mongoose")
const {
	Schema,
	model
} = mongoose

const pageSchema = new Schema({
	title: {
		type: String,
		trim: true
	},
	path: {
		type: String,
		trim: true
	},
	body: {
		type: String,
		trim: true
	}
}, {
	timestamps: true
});

const Page = model("Page", pageSchema);

module.exports = Page;