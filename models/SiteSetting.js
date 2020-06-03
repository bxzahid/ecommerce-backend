const mongoose = require("mongoose")
const {
	Schema,
	model
} = mongoose

const siteCofigSchema = new Schema({
	slider: {
		items: {
			image: ""
		}
	}
}, {
	timestamps: true
});

const siteCofig = model("siteCofig", siteCofigSchema);

module.exports = siteCofig;