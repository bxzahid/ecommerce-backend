const mongoose = require("mongoose")
const {
	Schema,
	model
} = mongoose

const homepageSchema = new Schema({
	title: {
		type: String,
		trim: true
	},
	path: {
		type: String,
		trim: true
	},
	body: [{
		type: Schema.Types.ObjectId
	}] // multiple ref will be added
}, {
	timestamps: true
});

const Homepage = model("Homepage", homepageSchema);

module.exports = Homepage;